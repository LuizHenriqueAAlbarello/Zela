import type { AssuntoContato, DadosContato, ErrosContato } from '../types/contato'

/** Opções do campo "Assunto": o valor guardado e o texto que aparece na tela. */
export const ASSUNTOS_CONTATO: { valor: AssuntoContato; rotulo: string }[] = [
  { valor: 'duvida', rotulo: 'Dúvida' },
  { valor: 'sugestao', rotulo: 'Sugestão' },
  { valor: 'problema', rotulo: 'Problema no site' },
  { valor: 'imprensa', rotulo: 'Imprensa' },
]

/** Tamanho mínimo da mensagem, em caracteres. */
export const MINIMO_MENSAGEM = 20

/** Quantidade mínima de letras no nome. */
export const MINIMO_LETRAS_NOME = 3

/** Formato de e-mail: algo@algo.algo, sem espaços. */
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Confere os dados do formulário de contato antes de enviar.
 * Devolve um objeto só com os campos que têm erro; objeto vazio quer dizer que está tudo certo.
 */
export function validarContato(dados: DadosContato): ErrosContato {
  const erros: ErrosContato = {}

  const nome = dados.nome.trim()
  // \p{L} conta qualquer letra, inclusive acentuadas (ã, é, ç)
  const letrasNoNome = nome.match(/\p{L}/gu)?.length ?? 0
  if (!nome) {
    erros.nome = 'Informe seu nome.'
  } else if (letrasNoNome < MINIMO_LETRAS_NOME) {
    erros.nome = `O nome precisa ter pelo menos ${MINIMO_LETRAS_NOME} letras.`
  }

  const email = dados.email.trim()
  if (!email) {
    erros.email = 'Informe seu e-mail.'
  } else if (!FORMATO_EMAIL.test(email)) {
    erros.email = 'Digite um e-mail válido, como nome@exemplo.com.'
  }

  if (!dados.assunto) {
    erros.assunto = 'Escolha um assunto.'
  }

  const mensagem = dados.mensagem.trim()
  if (!mensagem) {
    erros.mensagem = 'Escreva sua mensagem.'
  } else if (mensagem.length < MINIMO_MENSAGEM) {
    const faltam = MINIMO_MENSAGEM - mensagem.length
    erros.mensagem = `A mensagem precisa ter pelo menos ${MINIMO_MENSAGEM} caracteres (faltam ${faltam}).`
  }

  return erros
}

/** Tempo da simulação de envio, em milissegundos. */
const TEMPO_ENVIO = 800

/**
 * Envia a mensagem de contato.
 * O contato do Zela é só front-end: não existe rota de contato na API Java (a integração obrigatória
 * com a API está nas telas de chamados). Por isso o envio é simulado com uma espera curta.
 */
export function enviarContato(dados: DadosContato): Promise<DadosContato> {
  return new Promise((resolver) => {
    setTimeout(() => resolver(dados), TEMPO_ENVIO)
  })
}

/** E-mail da equipe. Enquanto estiver vazio, a linha de e-mail não aparece na página de Contato. */
export const EMAIL_EQUIPE = ''

/** Repositório público do projeto no GitHub. */
export const URL_REPOSITORIO = 'https://github.com/LuizHenriqueAAlbarello/Zela'
