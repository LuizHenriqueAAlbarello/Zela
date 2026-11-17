export type StatusChamado = 'ABERTO' | 'EM_ANALISE' | 'EM_EXECUCAO' | 'RESOLVIDO' | 'CANCELADO'


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
 
  peso: number
 
  prazoDias: number
}

export interface ChamadoResumo {
  id: number
  categoria: CategoriaId
  bairro: string
  status: StatusChamado
  apoios: number
}

export interface TempoPorZona {
  zona: string
  bairro: string
  dias: number
}