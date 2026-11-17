import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Variante = 'sodio' | 'contorno' | 'escuro'

interface BotaoLinkProps {
  para: string
  variante?: Variante
  children: ReactNode
  className?: string
}

const VARIANTES: Record<Variante, string> = {
  sodio: 'bg-sodio text-noite border-sodio hover:bg-[#ffb066] shadow-[0_8px_30px_-8px_rgba(255,154,60,.55)]',
  contorno: 'bg-transparent text-papel border-borda hover:border-papel',
  escuro: 'bg-noite text-papel border-noite hover:bg-noite-3',
}

export const CLASSE_BOTAO =
  'rotulo inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 text-[14px] no-underline transition-[background-color,border-color,color] duration-200 active:translate-y-px'

/** Link com cara de botão; usado nos CTAs de várias páginas. */
export default function BotaoLink({ para, variante = 'sodio', children, className = '' }: BotaoLinkProps) {
  return (
    <Link to={para} className={`${CLASSE_BOTAO} ${VARIANTES[variante]} ${className}`}>
      {children}
    </Link>
  )
}