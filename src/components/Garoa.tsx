import { useRef } from 'react'
import { useCanvasAnimado, type Cena } from '../hooks/useCanvasAnimado'

/** Uma gota caindo. */
interface Gota {
  x: number
  y: number
  velocidade: number
  comprimento: number
  opacidade: number
}

/** O círculo que a gota faz ao bater no chão. */
interface Respingo {
  x: number
  y: number
  raio: number
  vida: number
}

/** Um poste: de onde sai o cone de luz laranja. */
interface Poste {
  x: number
  y: number
  alcance: number
}

function criarCena(): Cena {
  let gotas: Gota[] = []
  let respingos: Respingo[] = []
  let postes: Poste[] = []
  const vento = 0.16 // inclinação da chuva

  const novaGota = (largura: number, altura: number, noTopo: boolean): Gota => ({
    x: Math.random() * (largura + altura * vento) - altura * vento,
    y: noTopo ? -Math.random() * 40 : Math.random() * altura,
    velocidade: 520 + Math.random() * 380,
    comprimento: 9 + Math.random() * 14,
    opacidade: 0.12 + Math.random() * 0.22,
  })

  return {
    preparar(largura, altura) {
      // Quantidade de gotas proporcional à área (celular tem menos)
      gotas = Array.from({ length: Math.round((largura * altura) / 5200) }, () => novaGota(largura, altura, false))
      respingos = []
      postes =
        largura < 768
          ? [{ x: largura * 0.82, y: 0, alcance: altura * 0.55 }]
          : [
              { x: largura * 0.14, y: 0, alcance: altura * 0.7 },
              { x: largura * 0.86, y: 0, alcance: altura * 0.6 },
            ]
    },

    desenhar({ ctx, largura, altura, dt }) {
      ctx.clearRect(0, 0, largura, altura)

      // Cone de luz de sódio de cada poste
      for (const p of postes) {
        const luz = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.alcance)
        luz.addColorStop(0, 'rgba(255,154,60,.20)')
        luz.addColorStop(0.5, 'rgba(255,154,60,.06)')
        luz.addColorStop(1, 'rgba(255,154,60,0)')
        ctx.fillStyle = luz
        ctx.fillRect(p.x - p.alcance, 0, p.alcance * 2, p.alcance)
      }

      // Garoa: cada gota acende quando passa pela luz do poste
      ctx.lineWidth = 1
      for (const g of gotas) {
        g.y += g.velocidade * dt
        g.x += g.velocidade * vento * dt

        // Chegou ao chão: às vezes respinga, e a gota volta para o topo
        if (g.y > altura) {
          if (Math.random() < 0.35) {
            respingos.push({ x: g.x, y: altura - Math.random() * altura * 0.12, raio: 0, vida: 1 })
          }
          Object.assign(g, novaGota(largura, altura, true))
        }

        // Quanto mais perto do poste, mais laranja e brilhante
        let iluminada = 0
        for (const p of postes) {
          const dist = Math.hypot(g.x - p.x, g.y - p.y)
          if (dist < p.alcance) iluminada = Math.max(iluminada, 1 - dist / p.alcance)
        }
        ctx.strokeStyle =
          iluminada > 0.05
            ? `rgba(255,${190 + Math.round(40 * (1 - iluminada))},${140 + Math.round(80 * (1 - iluminada))},${(g.opacidade + iluminada * 0.55).toFixed(2)})`
            : `rgba(170,184,214,${g.opacidade.toFixed(2)})`

        ctx.beginPath()
        ctx.moveTo(g.x, g.y)
        ctx.lineTo(g.x - g.comprimento * vento, g.y - g.comprimento)
        ctx.stroke()
      }

      // Respingos no asfalto molhado: elipses que crescem e somem
      for (const r of respingos) {
        r.raio += 26 * dt
        r.vida -= 1.8 * dt
        ctx.strokeStyle = `rgba(170,184,214,${Math.max(0, r.vida * 0.35).toFixed(2)})`
        ctx.beginPath()
        ctx.ellipse(r.x, r.y, r.raio, r.raio * 0.3, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      respingos = respingos.filter((r) => r.vida > 0)
    },
  }
}

/** Fundo animado: a garoa de São Paulo caindo sob a luz dos postes. */
export default function Garoa({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useCanvasAnimado(ref, criarCena)
  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 size-full ${className}`} />
}