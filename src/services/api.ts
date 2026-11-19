
const URL_BASE: string = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')


export class ErroApi extends Error {
  status: number
  mensagem: string
  
  detalhes: string[]

  constructor(status: number, mensagem: string, detalhes: string[] = []) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
    this.mensagem = mensagem
    this.detalhes = detalhes
  }
}


export function ehCancelamento(erro: unknown): boolean {
  return erro instanceof DOMException && erro.name === 'AbortError'
}


export function mensagemDoErro(erro: unknown): string {
  return erro instanceof ErroApi ? erro.mensagem : 'Algo deu errado. Tente de novo.'
}

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function mensagemPadrao(status: number): string {
  if (status === 400) return 'Alguns dados não foram aceitos. Confira e tente de novo.'
  if (status === 404) return 'Não encontramos o que você procurou.'
  if (status === 409) return 'Essa ação conflita com o que já existe.'
  if (status >= 500) return 'O servidor teve um problema. Tente de novo em instantes.'
  return 'Algo deu errado. Tente de novo.'
}


function textoDoDetalhe(detalhe: unknown): string {
  if (typeof detalhe === 'string') return detalhe
  if (ehObjeto(detalhe)) {
    const campo = typeof detalhe.campo === 'string' ? detalhe.campo : ''
    const texto =
      typeof detalhe.mensagem === 'string' ? detalhe.mensagem : typeof detalhe.erro === 'string' ? detalhe.erro : ''
    return campo && texto ? `${campo}: ${texto}` : texto
  }
  return ''
}


async function lerErro(resposta: Response): Promise<ErroApi> {
  let mensagem = mensagemPadrao(resposta.status)
  let detalhes: string[] = []
  try {
    const corpo: unknown = await resposta.json()
    if (ehObjeto(corpo)) {
      if (typeof corpo.erro === 'string' && corpo.erro.trim()) mensagem = corpo.erro
      if (Array.isArray(corpo.detalhes)) detalhes = corpo.detalhes.map(textoDoDetalhe).filter(Boolean)
    }
  } catch {
    
  }
  return new ErroApi(resposta.status, mensagem, detalhes)
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE'


async function requisitar<T>(metodo: Metodo, caminho: string, corpo?: unknown, signal?: AbortSignal): Promise<T> {
  if (!URL_BASE) {
    throw new ErroApi(0, 'A URL da API não está configurada. Crie o arquivo .env com VITE_API_URL.')
  }

  const temCorpo = corpo !== undefined
  let resposta: Response
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      
      headers: temCorpo ? { Accept: 'application/json', 'Content-Type': 'application/json' } : { Accept: 'application/json' },
      body: temCorpo ? JSON.stringify(corpo) : undefined,
      signal,
    })
  } catch (erro) {
    if (ehCancelamento(erro)) throw erro
    
    throw new ErroApi(0, 'Não conseguimos falar com o servidor. Confira sua conexão e tente de novo.')
  }

  if (!resposta.ok) throw await lerErro(resposta)

  
  if (resposta.status === 204) return undefined as T

  try {
    return (await resposta.json()) as T
  } catch (erro) {
    if (ehCancelamento(erro)) throw erro
    throw new ErroApi(resposta.status, 'O servidor respondeu em um formato inesperado.')
  }
}


export const api = {
  get: <T>(caminho: string, signal?: AbortSignal) => requisitar<T>('GET', caminho, undefined, signal),
  post: <T>(caminho: string, corpo?: unknown, signal?: AbortSignal) => requisitar<T>('POST', caminho, corpo ?? {}, signal),
  put: <T>(caminho: string, corpo: unknown, signal?: AbortSignal) => requisitar<T>('PUT', caminho, corpo, signal),
  apagar: (caminho: string, signal?: AbortSignal) => requisitar<void>('DELETE', caminho, undefined, signal),
}