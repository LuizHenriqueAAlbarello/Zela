import { useEffect, useRef, useState } from 'react'
import type { StatusChamado } from '../types/chamado'
import SeloStatus from './SeloStatus'

/** Uma etapa do caminho: o status e, opcionalmente, quem age e o que acontece. */
export interface Parada {
  status: Exclude<StatusChamado, 'CANCELADO'>
  quem?: string
  texto?: string
}

interface CaminhoLuzProps {
  paradas: Parada[]
  /**
   * Índice da parada atual (tela de detalhe). Sem valor, os postes acendem
   * conforme a pessoa rola a página (modo explicativo da Home).
   */
  atual?: number
}

/**
 * O andamento do chamado como uma rua com postes: cada etapa concluída acende um poste.
 * Horizontal a partir de lg (1024px); vertical no celular e no tablet.
 */
export default function CaminhoLuz({ paradas, atual }: CaminhoLuzProps) {
  const ref = useRef<HTMLOListElement>(null)
  const trechos = paradas.length - 1
  // progresso vai de 0 (nada aceso) a 1 (tudo aceso)
  const [progresso, setProgresso] = useState<number>(atual !== undefined ? atual / trechos : 1)

  useEffect(() => {
    if (atual !== undefined) {
      setProgresso(atual / trechos)
      return
    }
    // Quem pede menos movimento vê tudo aceso, sem depender da rolagem
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let pedido = 0
    const medir = () => {
      pedido = 0
      const caixa = ref.current?.getBoundingClientRect()
      if (!caixa) return
      const vh = window.innerHeight
      // Começa a acender quando o caminho entra na tela e termina perto do meio dela
      const p = (vh * 0.85 - caixa.top) / (caixa.height + vh * 0.35)
      setProgresso(Math.max(0, Math.min(1, p)))
    }
    // requestAnimationFrame: no máximo um cálculo por quadro, mesmo rolando rápido
    const aoRolar = () => {
      if (!pedido) pedido = requestAnimationFrame(medir)
    }
    medir()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    return () => {
      cancelAnimationFrame(pedido)
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
    }
  }, [atual, trechos])

  return (
    <ol ref={ref} className="grid gap-12 lg:grid-cols-4 lg:gap-8">
      {paradas.map((p, i) => {
        const aceso = progresso * trechos >= i - 0.001
        // Quanto do fio até o próximo poste já está aceso (0 a 1)
        const fio = Math.max(0, Math.min(1, progresso * trechos - i))
        const ultimo = i === trechos

        return (
          <li key={p.status} className="relative pl-12 lg:pt-16 lg:pl-0" aria-current={i === atual ? 'step' : undefined}>
            {/* Fio até o próximo poste: vertical no celular, horizontal no desktop */}
            {!ultimo && (
              <span
                aria-hidden="true"
                className="absolute top-8 -bottom-11 left-[11px] w-px bg-borda lg:top-[11px] lg:right-[-28px] lg:bottom-auto lg:left-8 lg:h-px lg:w-auto"
              >
                {/* Trecho aceso: cresce para baixo no celular e para a direita no desktop */}
                <span
                  className="absolute inset-0 origin-top bg-sodio shadow-[0_0_14px_rgba(255,154,60,.8)] lg:hidden"
                  style={{ transform: `scaleY(${fio})` }}
                />
                <span
                  className="absolute inset-0 hidden origin-left bg-sodio shadow-[0_0_14px_rgba(255,154,60,.8)] lg:block"
                  style={{ transform: `scaleX(${fio})` }}
                />
              </span>
            )}

            {/* O poste (a lâmpada) */}
            <span
              aria-hidden="true"
              className={`absolute top-1 left-0 grid size-6 place-items-center rounded-full border transition-[background-color,border-color,box-shadow] duration-500 lg:top-0 ${
                aceso ? 'border-sodio bg-sodio shadow-[0_0_24px_6px_rgba(255,154,60,.45)]' : 'border-borda bg-noite'
              }`}
            >
              <span className={`size-2 rounded-full ${aceso ? 'bg-noite' : 'bg-borda'}`} />
            </span>

            <SeloStatus status={p.status} tamanho="md" />
            {p.quem && <span className="titulo mt-4 block text-[26px]">{p.quem}</span>}
            {p.texto && <span className="mt-2 block max-w-[34ch] text-[15px] text-mudo">{p.texto}</span>}
          </li>
        )
      })}
    </ol>
  )
}