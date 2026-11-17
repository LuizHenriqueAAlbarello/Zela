import { useRef, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Integrante } from '../types/integrante'
import AvatarIntegrante from './AvatarIntegrante'
import LinksIntegrante from './LinksIntegrante'

interface CartaoIntegranteProps {
  integrante: Integrante
  /** Posição na lista: define o atraso da entrada em cascata */
  indice?: number
}

/**
 * Card de um integrante. Ao passar o mouse, uma luz de poste segue o cursor,
 * o card inclina levemente e a foto ganha cor. O card inteiro leva ao perfil.
 */
export default function CartaoIntegrante({ integrante, indice = 0 }: CartaoIntegranteProps) {
  const ref = useRef<HTMLElement>(null)

  // Guarda a posição do mouse em variáveis CSS; o CSS cuida da luz e da inclinação
  function aoMover(e: PointerEvent<HTMLElement>) {
    const cartao = ref.current
    if (!cartao || e.pointerType !== 'mouse') return
    const caixa = cartao.getBoundingClientRect()
    const x = (e.clientX - caixa.left) / caixa.width // 0 a 1
    const y = (e.clientY - caixa.top) / caixa.height // 0 a 1
    cartao.style.setProperty('--luz-x', `${x * 100}%`)
    cartao.style.setProperty('--luz-y', `${y * 100}%`)
    cartao.style.setProperty('--giro-x', `${(0.5 - y) * 6}deg`)
    cartao.style.setProperty('--giro-y', `${(x - 0.5) * 8}deg`)
  }

  function aoSair() {
    const cartao = ref.current
    if (!cartao) return
    cartao.style.setProperty('--giro-x', '0deg')
    cartao.style.setProperty('--giro-y', '0deg')
  }

  return (
    <article
      ref={ref}
      onPointerMove={aoMover}
      onPointerLeave={aoSair}
      style={{ animationDelay: `${indice * 110}ms` }}
      className="group relative flex h-full animate-chegar flex-col overflow-hidden rounded-3xl border border-borda bg-noite-2 p-7 transition-[transform,border-color] duration-300 ease-saida [transform:perspective(900px)_rotateX(var(--giro-x,0deg))_rotateY(var(--giro-y,0deg))] hover:border-sodio/50 motion-reduce:[transform:none]"
    >
      {/* Luz de poste que segue o cursor */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(320px_circle_at_var(--luz-x,50%)_var(--luz-y,0%),rgba(255,154,60,.16),transparent_65%)]"
      />

      <div className="relative flex flex-1 flex-col items-center text-center">
        <AvatarIntegrante integrante={integrante} />

        <h2 className="titulo mt-7 text-[22px] leading-[1.05]">
          {/* O link "estica" por cima do card inteiro (::after), então clicar em qualquer lugar abre o perfil */}
          <Link
            to={`/integrantes/${integrante.rm}`}
            className="text-papel no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {integrante.nome}
          </Link>
        </h2>

        <p className="mt-3 text-[14px] text-mudo">
          RM <span className="numeros font-semibold text-papel">{integrante.rm}</span> · {integrante.turma}
        </p>

        {/* mt-auto empurra os links para o fim: os cards ficam alinhados mesmo com nomes de tamanhos diferentes */}
        <div className="mt-auto flex flex-col items-center pt-6">
          <LinksIntegrante integrante={integrante} className="justify-center" />
        </div>

        <span className="rotulo mt-6 inline-flex items-center gap-1.5 text-[12px] text-mudo transition-colors group-hover:text-sodio">
          Ver perfil
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.6} aria-hidden="true" />
        </span>
      </div>

      {/* Anel de foco visível quando o card é alcançado pelo teclado */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl ring-sodio group-has-[a:focus-visible]:ring-3"
      />
    </article>
  )
}