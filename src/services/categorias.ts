
import type {
  Categoria,
  CategoriaId,
  CategoriaApiId,
} from '../types/chamado'

export const CATEGORIAS: Categoria[] = [
  { id: 'BURACO', nome: 'Buraco na via', peso: 4, prazoDias: 15 },
  { id: 'ILUMINACAO', nome: 'Iluminação pública', peso: 3, prazoDias: 7 },
  { id: 'LIXO', nome: 'Lixo e entulho', peso: 3, prazoDias: 5 },
  { id: 'ARVORE', nome: 'Árvore caída ou com risco', peso: 5, prazoDias: 3 },
  { id: 'CALCADA', nome: 'Calçada danificada', peso: 3, prazoDias: 30 },
  { id: 'SINALIZACAO', nome: 'Sinalização', peso: 4, prazoDias: 10 },
  { id: 'BOCA_DE_LOBO', nome: 'Boca de lobo entupida', peso: 4, prazoDias: 7 },
]

const IDS_CATEGORIAS: Record<CategoriaId, CategoriaApiId> = {
  BURACO: 1,
  ILUMINACAO: 2,
  LIXO: 3,
  ARVORE: 4,
  CALCADA: 5,
  SINALIZACAO: 6,
  BOCA_DE_LOBO: 7,
}

export function categoriaParaApi(id: CategoriaId): CategoriaApiId {
  return IDS_CATEGORIAS[id]
}

export function nomeCategoria(id: CategoriaId): string {
  return CATEGORIAS.find((categoria) => categoria.id === id)?.nome ?? id
}


export function categoriaDaApi(id: CategoriaApiId): CategoriaId {
  const categorias: Record<CategoriaApiId, CategoriaId> = {
    1: 'BURACO',
    2: 'ILUMINACAO',
    3: 'LIXO',
    4: 'ARVORE',
    5: 'CALCADA',
    6: 'SINALIZACAO',
    7: 'BOCA_DE_LOBO',
  }

  return categorias[id]
}
