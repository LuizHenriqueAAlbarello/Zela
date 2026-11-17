import type { ChamadoResumo, TempoPorZona } from '../types/chamado'

export const CHAMADOS_RECENTES: ChamadoResumo[] = [
  { id: 412, categoria: 'BURACO', bairro: 'Grajaú', status: 'EM_EXECUCAO', apoios: 23 },
  { id: 431, categoria: 'ARVORE', bairro: 'Itaquera', status: 'ABERTO', apoios: 6 },
  { id: 398, categoria: 'BOCA_DE_LOBO', bairro: 'Capão Redondo', status: 'EM_ANALISE', apoios: 11 },
  { id: 377, categoria: 'LIXO', bairro: 'Cidade Tiradentes', status: 'RESOLVIDO', apoios: 4 },
  { id: 420, categoria: 'ILUMINACAO', bairro: 'Brasilândia', status: 'ABERTO', apoios: 9 },
  { id: 405, categoria: 'CALCADA', bairro: 'São Miguel', status: 'EM_ANALISE', apoios: 15 },
]

export const TEMPO_POR_ZONA: TempoPorZona[] = [
  { zona: 'Zona 2', bairro: 'São Miguel', dias: 11.5 },
  { zona: 'Zona 7', bairro: 'Cidade Tiradentes', dias: 11.3 },
  { zona: 'Zona 5', bairro: 'Perus', dias: 10.9 },
  { zona: 'Zona 3', bairro: 'Raposo Tavares', dias: 10.5 },
  { zona: 'Zona 1', bairro: 'Grajaú', dias: 10.3 },
  { zona: 'Zona 0', bairro: 'Brasilândia', dias: 9.5 },
  { zona: 'Zona 4', bairro: 'Lapa', dias: 8.0 },
  { zona: 'Zona 6', bairro: 'Tatuapé', dias: 7.8 },
]