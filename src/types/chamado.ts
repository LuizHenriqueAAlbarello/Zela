/** Os status que o chamado percorre, iguais aos da API Java. */
export type StatusChamado = 'ABERTO' | 'EM_ANALISE' | 'EM_EXECUCAO' | 'RESOLVIDO' | 'CANCELADO'

/** Identificador de cada categoria de problema. */
export type CategoriaId =
  | 'BURACO'
  | 'ILUMINACAO'
  | 'LIXO'
  | 'ARVORE'
  | 'CALCADA'
  | 'SINALIZACAO'
  | 'BOCA_DE_LOBO'

export interface Categoria {
  id: CategoriaId
  nome: string
  /** Peso inicial da prioridade (regra RN04) */
  peso: number
  /** Prazo de referência em dias */
  prazoDias: number
}

/** O mínimo de um chamado para aparecer em listas, no letreiro e no mapa. */
export interface ChamadoResumo {
  id: number
  categoria: CategoriaId
  bairro: string
  status: StatusChamado
  apoios: number
}

/** Tempo médio de resolução de uma zona da cidade. */
export interface TempoPorZona {
  zona: string
  bairro: string
  dias: number
}