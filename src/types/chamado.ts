
export type StatusChamado =
  | 'ABERTO'
  | 'EM_ANALISE'
  | 'EM_EXECUCAO'
  | 'RESOLVIDO'
  | 'CANCELADO'

export type CategoriaId =
  | 'BURACO'
  | 'ILUMINACAO'
  | 'LIXO'
  | 'ARVORE'
  | 'CALCADA'
  | 'SINALIZACAO'
  | 'BOCA_DE_LOBO'

export type CategoriaApiId = 1 | 2 | 3 | 4 | 5 | 6 | 7

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

export interface Chamado extends ChamadoResumo {
  protocolo?: string
  descricao: string
  endereco: string
  latitude?: number | null
  longitude?: number | null
  prioridade: number
  prazoPrevistoDias?: number | null
  prazoPrevistoData?: string | null
  riscoAtraso?: number | null
  criadoEm: string
  atualizadoEm?: string | null
}

export interface ChamadoApi {
  id: number
  protocolo?: string
  categoriaId: CategoriaApiId
  cidadaoId: number
  descricao: string
  endereco: string
  bairro: string
  latitude: number | null
  longitude: number | null
  status: StatusChamado
  prioridade: number
  dataAbertura: string
  prazoPrevisto: string | null
  nota?: number | null
  apoios: number
}

export interface NovoChamado {
  categoriaId: CategoriaApiId
  cidadaoId: number
  descricao: string
  endereco: string
  bairro: string
  latitude?: number
  longitude?: number
}

export interface Atualizacao {
  id: number
  status: StatusChamado
  mensagem: string
  criadoEm: string
}

export interface TempoPorZona {
  zona: string
  bairro: string
  dias: number
}
