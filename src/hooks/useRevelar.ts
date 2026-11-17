import { useEffect } from 'react'

/**
 * Marca os elementos com [data-revela] como "visivel" quando eles entram na tela.
 * O CSS (em index.css) usa essa marca para animar as barras do gráfico.
 */
export function useRevelar() {
  useEffect(() => {
    // Sem esta classe, tudo aparece pronto (por exemplo, se o JavaScript falhar)
    document.documentElement.classList.add('js-revela')

    const alvos = document.querySelectorAll<HTMLElement>('[data-revela]:not(.visivel)')
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel')
            observador.unobserve(entrada.target) // anima só uma vez
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    alvos.forEach((alvo) => observador.observe(alvo))
    return () => observador.disconnect()
  }, [])
}