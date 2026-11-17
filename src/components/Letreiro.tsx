import { Link } from 'react-router-dom'
import type { ChamadoResumo } from '../types/chamado'
import { nomeCategoria } from '../services/categorias'
import SeloStatus from './SeloStatus'

interface LetreiroProps {
  chamados: ChamadoResumo[]
}

/** Faixa com os chamados recentes passando. O conteúdo é duplicado para o laço ficar contínuo. */
export default function Letreiro({ chamados }: LetreiroProps) {
  const item = (c: ChamadoResumo, copia: boolean) => (
    <li key={`${copia ? 'b' : 'a'}-${c.id}`} className="flex shrink-0 items-center gap-3">
      <Link
        to={`/chamados/${c.id}`}
        tabIndex={copia ? -1 : undefined}
        className="flex items-center gap-2.5 whitespace-nowrap text-[15px] font-medium text-papel no-underline hover:text-sodio"
      >
        <span className="numeros text-mudo">#{String(c.id).padStart(4, '0')}</span>
        <span>{nomeCategoria(c.categoria)} · {c.bairro}</span>
      </Link>
      <SeloStatus status={c.status} />
    </li>
  )

  return (
    <section
      aria-label="Chamados recentes"
      className="group overflow-hidden border-y border-borda bg-noite-2 py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    >
      <div className="flex w-max animate-letreiro gap-12 pr-12 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
        <ul className="flex gap-12">{chamados.map((c) => item(c, false))}</ul>
        {/* Cópia só visual: escondida do leitor de tela e do Tab */}
        <ul className="flex gap-12" aria-hidden="true">{chamados.map((c) => item(c, true))}</ul>
      </div>
    </section>
  )
}