import { useEffect, type RefObject } from 'react'

export interface QuadroCanvas {
  ctx: CanvasRenderingContext2D
  largura: number
  altura: number
  t: number
  dt: number
}


export interface Cena {
  preparar: (largura: number, altura: number, reduzido: boolean) => void
  desenhar: (q: QuadroCanvas) => void
  destruir?: () => void
}


export function useCanvasAnimado(ref: RefObject<HTMLCanvasElement | null>, criarCena: () => Cena) {
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cena = criarCena()
    let largura = 0
    let altura = 0
    let quadro = 0
    let visivel = true
    let inicio = performance.now()
    let anterior = inicio
    let ativo = true

    function medir() {
      const caixa = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      largura = Math.max(1, Math.round(caixa.width))
      altura = Math.max(1, Math.round(caixa.height))
      canvas!.width = largura * dpr
      canvas!.height = altura * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      cena.preparar(largura, altura, reduzido)
      if (reduzido) desenharUma()
    }

    function desenharUma() {
      cena.desenhar({ ctx: ctx!, largura, altura, t: 0, dt: 1 / 60 })
    }

    function laco(agora: number) {
      const dt = Math.min((agora - anterior) / 1000, 1 / 20)
      anterior = agora
      cena.desenhar({ ctx: ctx!, largura, altura, t: (agora - inicio) / 1000, dt })
      quadro = requestAnimationFrame(laco)
    }

    function ligar() {
      if (reduzido || quadro || !visivel || document.hidden) return
      anterior = performance.now()
      quadro = requestAnimationFrame(laco)
    }

    function desligar() {
      cancelAnimationFrame(quadro)
      quadro = 0
    }


    const observaTamanho = new ResizeObserver(() => medir())
    observaTamanho.observe(canvas)


    const observaTela = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
      if (visivel) ligar()
      else desligar()
    })
    observaTela.observe(canvas)


    const aoTrocarAba = () => {
      if (document.hidden) desligar()
      else ligar()
    }
    document.addEventListener('visibilitychange', aoTrocarAba)

    medir()

    document.fonts?.ready.then(() => {
      if (ativo) medir()
    })
    inicio = performance.now()
    ligar()


    return () => {
      ativo = false
      desligar()
      observaTamanho.disconnect()
      observaTela.disconnect()
      document.removeEventListener('visibilitychange', aoTrocarAba)
      cena.destruir?.()
    }
  }, [ref])
}