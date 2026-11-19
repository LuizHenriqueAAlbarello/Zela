import { api } from './api'
import type { Atualizacao, Chamado, NovoChamado } from '../types/chamado'

/** GET /chamados: todos os chamados. */
export function listarChamados(signal?: AbortSignal): Promise<Chamado[]> {
  return api.get<Chamado[]>('/chamados', signal)
}

/** GET /chamados/{id}: um chamado. Dá 404 se não existir. */
export function buscarChamado(id: number, signal?: AbortSignal): Promise<Chamado> {
  return api.get<Chamado>(`/chamados/${id}`, signal)
}

/** POST /chamados: abre um chamado. Dá 409 (RN01) se já existe um aberto igual naquele endereço. */
export function criarChamado(dados: NovoChamado, signal?: AbortSignal): Promise<Chamado> {
  return api.post<Chamado>('/chamados', dados, signal)
}

/** GET /chamados/{id}/atualizacoes: o histórico do chamado. */
export function listarAtualizacoes(id: number, signal?: AbortSignal): Promise<Atualizacao[]> {
  return api.get<Atualizacao[]>(`/chamados/${id}/atualizacoes`, signal)
}

/** POST /chamados/{id}/apoios: "Eu também vi". Dá 409 (RN03) se já apoiou ou se é o autor. */
export function apoiarChamado(id: number, signal?: AbortSignal): Promise<void> {
  return api.post<void>(`/chamados/${id}/apoios`, undefined, signal)
}