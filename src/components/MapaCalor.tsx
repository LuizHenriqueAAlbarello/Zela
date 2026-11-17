import { useRef } from 'react'
import { useCanvasAnimado, type Cena } from '../hooks/useCanvasAnimado'

/** Um ponto quente (ou frio, se a força for negativa) do mapa. */
interface Foco {
  x: number
  y: number
  raio: number
  forca: number
  fase: number
}

function criarCena(): Cena {
  let focos: Foco[] = []
  const espaco = 16 // distância entre os pontos da grade

  return {
    preparar(largura, altura) {
      // Os focos quentes ficam nas bordas (os extremos da cidade); o centro é frio.
      focos = [
        { x: largura * 0.02, y: altura * 0.25, raio: largura * 0.22, forca: 1, fase: 0 },
        { x: largura * 0.97, y: altura * 0.18, raio: largura * 0.2, forca: 0.95, fase: 1.7 },
        { x: largura * 0.12, y: altura * 0.98, raio: largura * 0.24, forca: 0.9, fase: 3.1 },
        { x: largura * 0.88, y: altura * 0.95, raio: largura * 0.18, forca: 0.8, fase: 4.4 },
        { x: largura * 0.5, y: altura * 0.5, raio: largura * 0.12, forca: -0.5, fase: 2.2 },
      ]
    },

    desenhar({ ctx, largura, altura, t }) {
      ctx.clearRect(0, 0, largura, altura)

      // Uma grade de pontos, como quarteirões vistos do alto
      for (let y = espaco / 2; y < altura; y += espaco) {
        for (let x = espaco / 2; x < largura; x += espaco) {
          // Soma o calor de todos os focos (cai suavemente com a distância)
          let calor = 0
          for (const f of focos) {
            const dist2 = (x - f.x) ** 2 + (y - f.y) ** 2
            const pulso = 0.82 + 0.18 * Math.sin(t * 0.7 + f.fase)
            calor += f.forca * pulso * Math.exp(-dist2 / (f.raio * f.raio))
          }
          calor = Math.max(0, Math.min(1, calor))

          // Do quarteirão apagado (cinza azulado) até a luz de sódio
          const r = Math.round(60 + 195 * calor)
          const g = Math.round(66 + 88 * calor)
          const b = Math.round(84 - 24 * calor)
          ctx.fillStyle = `rgba(${r},${g},${b},${(0.18 + calor * 0.55).toFixed(2)})`
          const tamanho = 1.2 + calor * 1.6
          ctx.fillRect(x, y, tamanho, tamanho)
        }
      }
    },
  }
}

/** Fundo animado: a cidade em pontos, mais quente nos extremos, onde se espera mais. */
export default function MapaCalor({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useCanvasAnimado(ref, criarCena)
  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 size-full ${className}`} />
}