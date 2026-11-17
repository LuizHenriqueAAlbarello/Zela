import type { Categoria, CategoriaId } from '../types/chamado'

export const CATEGORIAS: Categoria[] = [
  { id: 'BURACO', nome: 'Buraco na via', peso: 4, prazoDias: 15 },
  { id: 'ILUMINACAO', nome: 'Iluminação pública', peso: 3, prazoDias: 7 },
  { id: 'LIXO', nome: 'Lixo e entulho', peso: 3, prazoDias: 5 },
  { id: 'ARVORE', nome: 'Árvore com risco', peso: 5, prazoDias: 3 },
  { id: 'CALCADA', nome: 'Calçada danificada', peso: 3, prazoDias: 30 },
  { id: 'SINALIZACAO', nome: 'Sinalização', peso: 4, prazoDias: 10 },
  { id: 'BOCA_DE_LOBO', nome: 'Boca de lobo entupida', peso: 4, prazoDias: 7 },
]

/** Devolve o nome legível de uma categoria ("BURACO" vira "Buraco na via"). */
export function nomeCategoria(id: CategoriaId): string {
  return CATEGORIAS.find((c) => c.id === id)?.nome ?? id
}