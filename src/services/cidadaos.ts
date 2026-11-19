import { api } from './api'

interface CidadaoApi {
  id: number
  nome: string
  email: string
}

const CHAVE = 'zela:cidadaoId'

function lerSalvo(): number | null {
  try {
    const valor = Number(localStorage.getItem(CHAVE))
    return Number.isInteger(valor) && valor > 0 ? valor : null
  } catch {
    return null
  }
}

/** Sem login: na primeira ação o site cadastra um cidadão visitante (POST /cidadaos) e guarda o id neste navegador. */
export async function obterCidadaoId(): Promise<number> {
  const salvo = lerSalvo()
  if (salvo) return salvo

  const sufixo = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  const novo = await api.post<CidadaoApi>('/cidadaos', {
    nome: 'Visitante do Zela',
    email: `visitante.${sufixo}@zela.app`,
  })

  try {
    localStorage.setItem(CHAVE, String(novo.id))
  } catch {
    // navegador sem localStorage: o id vale só até recarregar a página
  }
  return novo.id
}

/** Esquece o cidadão salvo (usado se a API não o encontrar mais). */
export function esquecerCidadao() {
  try {
    localStorage.removeItem(CHAVE)
  } catch {
    // nada a fazer
  }
}