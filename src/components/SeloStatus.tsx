import type { StatusChamado } from '../types/chamado'

interface SeloStatusProps {
  status: StatusChamado
  tamanho?: 'sm' | 'md'
}

const ROTULO: Record<StatusChamado, string> = {
  ABERTO: 'Aberto',
  EM_ANALISE: 'Em análise',
  EM_EXECUCAO: 'Em execução',
  RESOLVIDO: 'Resolvido',
  CANCELADO: 'Cancelado',
}

// Cada status é uma luz de cor diferente.
const ESTILO: Record<StatusChamado, { caixa: string; luz: string }> = {
  ABERTO: { caixa: 'text-sodio border-sodio/45 bg-sodio/10', luz: 'bg-sodio' },
  EM_ANALISE: { caixa: 'text-azul-noite border-azul-noite/45 bg-azul-noite/10', luz: 'bg-azul-noite' },
  EM_EXECUCAO: { caixa: 'text-ambar border-ambar/45 bg-ambar/10', luz: 'bg-ambar' },
  RESOLVIDO: { caixa: 'text-verde border-verde/45 bg-verde/10', luz: 'bg-verde' },
  CANCELADO: { caixa: 'text-mudo border-borda bg-noite-3 line-through', luz: 'bg-mudo' },
}

/** Nome legível de um status ("EM_ANALISE" vira "Em análise"). */
export function rotuloStatus(status: StatusChamado): string {
  return ROTULO[status]
}

/** Selo do status do chamado. Usado na lista, no detalhe, no letreiro e na Home. */
export default function SeloStatus({ status, tamanho = 'sm' }: SeloStatusProps) {
  const medida = tamanho === 'md' ? 'px-3 py-1.5 text-[13px]' : 'px-2.5 py-1 text-[11.5px]'
  const { caixa, luz } = ESTILO[status]
  return (
    <span className={`rotulo inline-flex items-center gap-2 whitespace-nowrap rounded-full border leading-none ${medida} ${caixa}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${luz} shadow-[0_0_8px_currentColor]`} />
      {ROTULO[status]}
    </span>
  )
}