import { ArrowUpRight } from 'lucide-react'
import type { Integrante } from '../types/integrante'

interface LinksIntegranteProps {
  integrante: Integrante
  className?: string
}

/** Botões de GitHub e LinkedIn. Quem ainda não preencheu aparece como "em breve". */
export default function LinksIntegrante({ integrante, className = '' }: LinksIntegranteProps) {
  const links = [
    { rotulo: 'GitHub', url: integrante.github },
    { rotulo: 'LinkedIn', url: integrante.linkedin },
  ]

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {links.map(({ rotulo, url }) => (
        <li key={rotulo}>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${rotulo} de ${integrante.nome} (abre em nova aba)`}
              className="relative z-10 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-borda px-4 text-[14px] font-semibold text-papel no-underline transition-colors hover:border-sodio hover:text-sodio"
            >
              {rotulo}
              <ArrowUpRight className="size-4" strokeWidth={2.4} aria-hidden="true" />
            </a>
          ) : (
            <span className="inline-flex min-h-10 items-center rounded-full border border-dashed border-borda px-4 text-[14px] text-mudo">
              {rotulo} em breve
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}