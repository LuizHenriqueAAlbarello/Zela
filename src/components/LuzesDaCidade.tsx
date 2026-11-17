import { useRef, type RefObject } from 'react'
import { useCanvasAnimado, type Cena } from '../hooks/useCanvasAnimado'

interface LuzesDaCidadeProps {
  /** Palavra desenhada pelas luzes */
  palavra: string
  /** Elemento invisível que marca onde a palavra deve ficar */
  palcoRef: RefObject<HTMLElement | null>
  className?: string
}

/** Uma luz da cidade: posição, velocidade e o ponto da palavra para onde ela vai. */
interface Luz {
  x: number
  y: number
  vx: number
  vy: number
  alvoX: number
  alvoY: number
  fase: number
  tamanho: number
  sodio: boolean
}

/** Uma avenida vista do alto: uma reta de (x1, y1) até (x2, y2). */
interface Rua {
  x1: number
  y1: number
  x2: number
  y2: number
  comprimento: number
}

/** Um carro andando numa rua. "posicao" vai de 0 (início da rua) a 1 (fim). */
interface Carro {
  rua: number
  posicao: number
  velocidade: number
  cor: string
  ida: boolean
}

const COR_LUZ = '236,232,224'
const COR_SODIO = '255,154,60'

/** Sorteio com semente fixa: a cidade sai igual toda vez que a página abre. */
function criarSorteio(semente: number) {
  let s = semente
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Escreve a palavra num canvas invisível e devolve os pontos que ficaram pintados. */
function pontosDaPalavra(palavra: string, larguraMax: number, alturaMax: number, passo: number) {
  const tela = document.createElement('canvas')
  const c = tela.getContext('2d') as CanvasRenderingContext2D & { fontStretch?: string }

  // Descobre o tamanho de fonte que faz a palavra caber na largura do palco
  let tamanho = 200
  c.font = `850 ${tamanho}px "Archivo Variable"`
  c.fontStretch = 'expanded'
  tamanho = Math.min((tamanho * larguraMax) / c.measureText(palavra).width, alturaMax * 1.3)

  tela.width = Math.ceil(larguraMax)
  tela.height = Math.ceil(tamanho * 1.05)
  c.font = `850 ${tamanho}px "Archivo Variable"`
  c.fontStretch = 'expanded'
  c.fillStyle = '#fff'
  const larguraTexto = c.measureText(palavra).width
  c.fillText(palavra, (tela.width - larguraTexto) / 2, tamanho * 0.86)

  // Varre a imagem em grade: cada pixel pintado vira um ponto de luz
  const dados = c.getImageData(0, 0, tela.width, tela.height).data
  const pontos: Array<[number, number]> = []
  for (let y = 0; y < tela.height; y += passo) {
    for (let x = 0; x < tela.width; x += passo) {
      const opacidade = dados[(y * tela.width + x) * 4 + 3]
      if (opacidade > 140) pontos.push([x, y])
    }
  }
  return { pontos, larguraTela: tela.width, alturaTela: tela.height }
}

function criarCena(
  palavra: string,
  palcoRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
): Cena {
  let luzes: Luz[] = []
  let ruas: Rua[] = []
  let carros: Carro[] = []
  const ponteiro = { x: -9999, y: -9999 }

  // O mouse (ou o dedo) espanta as luzes
  const aoMover = (e: PointerEvent) => {
    const caixa = canvasRef.current?.getBoundingClientRect()
    if (!caixa) return
    ponteiro.x = e.clientX - caixa.left
    ponteiro.y = e.clientY - caixa.top
  }
  const aoSair = () => {
    ponteiro.x = -9999
    ponteiro.y = -9999
  }
  window.addEventListener('pointermove', aoMover, { passive: true })
  document.addEventListener('pointerleave', aoSair)

  return {
    destruir() {
      window.removeEventListener('pointermove', aoMover)
      document.removeEventListener('pointerleave', aoSair)
    },

    preparar(largura, altura, reduzido) {
      const sorteio = criarSorteio(42)

      // Ruas: retas longas que cruzam o quadro, como avenidas vistas do alto
      ruas = []
      for (let i = 0; i < 9; i++) {
        const horizontal = i % 2 === 0
        const desvio = (sorteio() - 0.5) * 0.5
        const base = (i + 0.5) / 9
        const x1 = horizontal ? -40 : largura * (base + desvio * 0.3)
        const y1 = horizontal ? altura * (base + desvio * 0.2) : -40
        const x2 = horizontal ? largura + 40 : x1 + (sorteio() - 0.5) * largura * 0.6
        const y2 = horizontal ? y1 + (sorteio() - 0.5) * altura * 0.5 : altura + 40
        ruas.push({ x1, y1, x2, y2, comprimento: Math.hypot(x2 - x1, y2 - y1) })
      }

      // Carros: faróis brancos, luzes de sódio e lanternas vermelhas
      carros = Array.from({ length: Math.round(largura / 34) }, () => ({
        rua: Math.floor(sorteio() * ruas.length),
        posicao: sorteio(),
        velocidade: 40 + sorteio() * 70,
        cor: sorteio() < 0.55 ? '255,236,210' : sorteio() < 0.7 ? COR_SODIO : '255,90,70',
        ida: sorteio() < 0.5,
      }))

      // Onde a palavra fica: a posição do "palco" em relação ao canvas
      const caixaCanvas = canvasRef.current!.getBoundingClientRect()
      const palco = palcoRef.current?.getBoundingClientRect()
      const palcoX = palco ? palco.left - caixaCanvas.left : largura * 0.1
      const palcoY = palco ? palco.top - caixaCanvas.top : altura * 0.1
      const palcoL = palco ? palco.width : largura * 0.8
      const palcoA = palco ? palco.height : altura * 0.3

      const passo = largura < 640 ? 3 : 4
      const { pontos, larguraTela, alturaTela } = pontosDaPalavra(palavra, palcoL, palcoA, passo)
      const origemX = palcoX + (palcoL - larguraTela) / 2
      const origemY = palcoY + (palcoA - alturaTela) / 2

      // Cada ponto da palavra vira uma luz que nasce espalhada pela tela
      const anteriores = luzes
      luzes = pontos.map(([x, y], i) => {
        const anterior = anteriores[i]
        const alvoX = origemX + x + (sorteio() - 0.5) * passo * 1.1
        const alvoY = origemY + y + (sorteio() - 0.5) * passo * 1.1
        return {
          // Com movimento reduzido, a palavra já aparece montada
          x: reduzido ? alvoX : (anterior?.x ?? sorteio() * largura),
          y: reduzido ? alvoY : (anterior?.y ?? sorteio() * altura),
          vx: 0,
          vy: 0,
          alvoX,
          alvoY,
          fase: sorteio() * Math.PI * 2,
          tamanho: 1.1 + sorteio() * 1.3,
          sodio: sorteio() < 0.09,
        }
      })

      // Luzes soltas: janelas acesas espalhadas pela cidade (ficam paradas)
      for (let i = 0; i < Math.round((largura * altura) / 4200); i++) {
        const x = sorteio() * largura
        const y = sorteio() * altura
        luzes.push({
          x, y, vx: 0, vy: 0, alvoX: x, alvoY: y,
          fase: sorteio() * Math.PI * 2,
          tamanho: 0.8 + sorteio() * 0.8,
          sodio: sorteio() < 0.25,
        })
      }
    },

    desenhar({ ctx, largura, altura, t, dt }) {
      // Céu
      ctx.fillStyle = '#07080C'
      ctx.fillRect(0, 0, largura, altura)

      // Ruas
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(70,78,96,.28)'
      ctx.beginPath()
      for (const rua of ruas) {
        ctx.moveTo(rua.x1, rua.y1)
        ctx.lineTo(rua.x2, rua.y2)
      }
      ctx.stroke()

      // Carros correndo pelas ruas, com rastro de luz
      for (const carro of carros) {
        const rua = ruas[carro.rua]
        carro.posicao += ((carro.ida ? 1 : -1) * carro.velocidade * dt) / rua.comprimento
        if (carro.posicao > 1) carro.posicao -= 1
        if (carro.posicao < 0) carro.posicao += 1

        const dirX = (rua.x2 - rua.x1) / rua.comprimento
        const dirY = (rua.y2 - rua.y1) / rua.comprimento
        const x = rua.x1 + (rua.x2 - rua.x1) * carro.posicao
        const y = rua.y1 + (rua.y2 - rua.y1) * carro.posicao
        const rastro = carro.ida ? -26 : 26

        const brilho = ctx.createLinearGradient(x, y, x + dirX * rastro, y + dirY * rastro)
        brilho.addColorStop(0, `rgba(${carro.cor},.9)`)
        brilho.addColorStop(1, `rgba(${carro.cor},0)`)
        ctx.strokeStyle = brilho
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + dirX * rastro, y + dirY * rastro)
        ctx.stroke()
      }

      // Luzes: uma "mola" puxa cada uma para o alvo; o ponteiro empurra para longe
      const raio = largura < 640 ? 60 : 110
      for (const luz of luzes) {
        const dx = luz.x - ponteiro.x
        const dy = luz.y - ponteiro.y
        const dist2 = dx * dx + dy * dy
        if (dist2 < raio * raio && dist2 > 0.01) {
          const dist = Math.sqrt(dist2)
          const forca = (1 - dist / raio) * 2.4
          luz.vx += (dx / dist) * forca
          luz.vy += (dy / dist) * forca
        }
        luz.vx = luz.vx * 0.86 + (luz.alvoX - luz.x) * 0.018
        luz.vy = luz.vy * 0.86 + (luz.alvoY - luz.y) * 0.018
        luz.x += luz.vx
        luz.y += luz.vy

        // Cintilar: cada luz pisca no seu próprio ritmo
        const cintilar = 0.55 + 0.45 * Math.sin(t * 1.6 + luz.fase)
        ctx.fillStyle = `rgba(${luz.sodio ? COR_SODIO : COR_LUZ},${(0.5 + cintilar * 0.5).toFixed(2)})`
        ctx.fillRect(luz.x, luz.y, luz.tamanho, luz.tamanho)
      }
    },
  }
}

/**
 * Fundo animado: São Paulo à noite vista do alto. As luzes da cidade se juntam
 * para escrever uma palavra e se espalham quando o ponteiro passa.
 */
export default function LuzesDaCidade({ palavra, palcoRef, className = '' }: LuzesDaCidadeProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  useCanvasAnimado(ref, () => criarCena(palavra, palcoRef, ref))
  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 size-full ${className}`} />
}