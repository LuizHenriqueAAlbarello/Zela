import type { ReactNode } from 'react'
import type { CategoriaId } from '../types/chamado'

interface CategoriaIconeProps {
  categoria: CategoriaId
  className?: string
}

// Ícones de traço desenhados para o Zela: todos em grade 24, traço 2, pontas arredondadas.
const TRACOS: Record<CategoriaId, ReactNode> = {
  BURACO: (
    <>
      <path d="M3 18h18" />
      <path d="M6.5 14.5c1.4-1.6 3.4-2.5 5.5-2.5s4.1.9 5.5 2.5" />
      <path d="M9 14.5l1.2 1.5M15 14.5l-1.2 1.5M12 12v1.6" />
      <path d="M12 3v2.5M12 8.5V9" />
    </>
  ),
  ILUMINACAO: (
    <>
      <path d="M8 21h4M10 21V6a3 3 0 0 1 3-3h1.5a3 3 0 0 1 3 3" />
      <path d="M14.5 6h6l-1 2.5h-4z" />
      <path d="M15.5 11.5l-.8 1.3M19.5 11.5l.8 1.3M17.5 12v1.6" />
    </>
  ),
  LIXO: (
    <>
      <path d="M4.5 7h15M9.5 7V4.5h5V7" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v5.5M14 11v5.5" />
    </>
  ),
  ARVORE: (
    <>
      <path d="M12 21v-6.5" />
      <path d="M12 14.5c-3.6 0-6-2.1-6-5a5.5 5.5 0 0 1 10.6-2.1A4 4 0 0 1 17.5 14c-1 .4-3.3.5-5.5.5z" transform="rotate(-12 12 21)" />
      <path d="M7 21h10" />
    </>
  ),
  CALCADA: (
    <>
      <path d="M3 9h18M3 15h18M9 3v6M15 9v6M8 15v6" />
      <path d="M13.5 15.5l1.8 2-1 1.5 1.7 2" />
    </>
  ),
  SINALIZACAO: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 3l7.5 9h-15z" />
      <path d="M12 7.2v2.3" />
      <path d="M8.5 21h7" />
    </>
  ),
  BOCA_DE_LOBO: (
    <>
      <rect x="3.5" y="7" width="17" height="10" rx="1.5" />
      <path d="M7.5 10v4M10.5 10v4M13.5 10v4M16.5 10v4" />
      <path d="M2 20.5c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
    </>
  ),
}

/** Ícone de uma categoria. Usa a cor do texto (currentColor), então muda de cor junto com ele. */
export default function CategoriaIcone({ categoria, className = 'size-6' }: CategoriaIconeProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TRACOS[categoria]}
    </svg>
  )
}