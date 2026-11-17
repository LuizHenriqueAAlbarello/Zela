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

/** Uma rua vista do alto: uma reta de (x1, y1) até (x2, y2). Avenidas são mais largas e rápidas. */
interface Rua {
  x1: number
  y1: number
  x2: number
  y2: number
  comprimento: number
  avenida: boolean
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

      // Ruas: uma malha de quarteirões levemente torta, como uma cidade vista do alto
      ruas = []
      const novaRua = (x1: number, y1: number, x2: number, y2: number, avenida: boolean) =>
        ruas.push({ x1, y1, x2, y2, comprimento: Math.hypot(x2 - x1, y2 - y1), avenida })

      // Ruas "horizontais": a cada 70 a 120px, com uma leve inclinação
      for (let y = 30 + sorteio() * 40; y < altura + 40; y += 70 + sorteio() * 50) {
        const inclinacao = (sorteio() - 0.5) * 60
        novaRua(-40, y, largura + 40, y + inclinacao, false)
      }
      // Ruas "verticais": a cada 90 a 150px
      for (let x = 20 + sorteio() * 60; x < largura + 40; x += 90 + sorteio() * 60) {
        const inclinacao = (sorteio() - 0.5) * 80
        novaRua(x, -40, x + inclinacao, altura + 40, false)
      }
      // Duas avenidas em diagonal cortando a malha
      novaRua(-40, altura * 0.95, largura + 40, altura * 0.62, true)
      novaRua(largura * 0.15, -40, largura * 0.7, altura + 40, true)

      // Carros: faróis brancos, lanternas vermelhas e alguns táxis laranja.
      // Avenidas têm mais carros e mais rápidos.
      carros = []
      ruas.forEach((rua, indice) => {
        const quantos = rua.avenida ? Math.round(rua.comprimento / 60) : Math.round(rua.comprimento / 260)
        for (let i = 0; i < quantos; i++) {
          const tipo = sorteio()
          carros.push({
            rua: indice,
            posicao: sorteio(),
            velocidade: (rua.avenida ? 70 : 30) + sorteio() * (rua.avenida ? 60 : 40),
            cor: tipo < 0.5 ? '255,236,210' : tipo < 0.85 ? '255,80,64' : COR_SODIO,
            ida: sorteio() < 0.5,
          })
        }
      })

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
      for (let i = 0; i < Math.round((largura * altura) / 9000); i++) {
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

      // Ruas: o asfalto em cinza bem escuro; avenidas mais largas
      for (const rua of ruas) {
        ctx.lineWidth = rua.avenida ? 7 : 3
        ctx.strokeStyle = rua.avenida ? 'rgba(52,58,74,.42)' : 'rgba(46,52,66,.32)'
        ctx.beginPath()
        ctx.moveTo(rua.x1, rua.y1)
        ctx.lineTo(rua.x2, rua.y2)
        ctx.stroke()
      }

      // Carros correndo pelas ruas, com rastro de luz
      for (const carro of carros) {
        const rua = ruas[carro.rua]
        carro.posicao += ((carro.ida ? 1 : -1) * carro.velocidade * dt) / rua.comprimento
        if (carro.posicao > 1) carro.posicao -= 1
        if (carro.posicao < 0) carro.posicao += 1

        const dirX = (rua.x2 - rua.x1) / rua.comprimento
        const dirY = (rua.y2 - rua.y1) / rua.comprimento
        // Mão dupla: cada sentido anda de um lado da rua
        const faixa = (carro.ida ? 1 : -1) * (rua.avenida ? 2 : 0.8)
        const x = rua.x1 + (rua.x2 - rua.x1) * carro.posicao - dirY * faixa
        const y = rua.y1 + (rua.y2 - rua.y1) * carro.posicao + dirX * faixa
        const rastro = (carro.ida ? -1 : 1) * (rua.avenida ? 34 : 20)

        // Rastro de luz atrás do carro
        const brilho = ctx.createLinearGradient(x, y, x + dirX * rastro, y + dirY * rastro)
        brilho.addColorStop(0, `rgba(${carro.cor},.75)`)
        brilho.addColorStop(1, `rgba(${carro.cor},0)`)
        ctx.strokeStyle = brilho
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + dirX * rastro, y + dirY * rastro)
        ctx.stroke()

        // O carro: um ponto de luz na frente do rastro
        ctx.fillStyle = `rgba(${carro.cor},1)`
        ctx.beginPath()
        ctx.arc(x, y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      // Luzes: uma "mola" puxa cada uma para o alvo; o ponteiro empurra para longe
      // raio: a partir de quantos pixels o mouse espanta | forca: o tamanho do empurrão
      const raio = largura < 640 ? 80 : 150
      for (const luz of luzes) {
        const dx = luz.x - ponteiro.x
        const dy = luz.y - ponteiro.y
        const dist2 = dx * dx + dy * dy
        if (dist2 < raio * raio && dist2 > 0.01) {
          const dist = Math.sqrt(dist2)
          const forca = (1 - dist / raio) * 3.6
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