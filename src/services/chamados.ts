import { api } from './api'
import { categoriaDaApi } from './categorias'
import type {
  Atualizacao,
  Chamado,
  ChamadoApi,
  NovoChamado,
} from '../types/chamado'

function converterChamado(dados: ChamadoApi): Chamado {
  return {
    id: dados.id,
    protocolo: dados.protocolo,
    categoria: categoriaDaApi(dados.categoriaId),
    bairro: dados.bairro,
    status: dados.status,
    apoios: dados.apoios,
    descricao: dados.descricao,
    endereco: dados.endereco,
    latitude: dados.latitude,
    longitude: dados.longitude,
    prioridade: dados.prioridade,
    prazoPrevistoData: dados.prazoPrevisto,
    criadoEm: dados.dataAbertura,
  }
}

/** GET /chamados: todos os chamados. */
export async function listarChamados(
  signal?: AbortSignal,
): Promise<Chamado[]> {
  const dados = await api.get<ChamadoApi[]>('/chamados', signal)
  return dados.map(converterChamado)
}

/** GET /chamados/{id}: um chamado. */
export async function buscarChamado(
  id: number,
  signal?: AbortSignal,
): Promise<Chamado> {
  const dados = await api.get<ChamadoApi>(`/chamados/${id}`, signal)
  return converterChamado(dados)
}

/** POST /chamados: abre um chamado. */
export async function criarChamado(
  dados: NovoChamado,
  signal?: AbortSignal,
): Promise<Chamado> {
  const resposta = await api.post<ChamadoApi>('/chamados', dados, signal)
  return converterChamado(resposta)
}

/** GET /chamados/{id}/atualizacoes: histórico. */
export function listarAtualizacoes(
  id: number,
  signal?: AbortSignal,
): Promise<Atualizacao[]> {
  return api.get<Atualizacao[]>(`/chamados/${id}/atualizacoes`, signal)
}

/** POST /chamados/{id}/apoios: o cidadão apoia um chamado ("eu também vi isso"). */
export function apoiarChamado(
  id: number,
  cidadaoId: number,
  signal?: AbortSignal,
): Promise<void> {
  return api.post<void>(`/chamados/${id}/apoios`, { cidadaoId }, signal)
}