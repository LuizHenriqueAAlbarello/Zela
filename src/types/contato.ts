/** Assuntos que a pessoa pode escolher no formulário de contato. */
export type AssuntoContato = 'duvida' | 'sugestao' | 'problema' | 'imprensa'

/** Os dados digitados no formulário de contato. */
export interface DadosContato {
  nome: string
  email: string
  /** Vazio enquanto a pessoa ainda não escolheu um assunto */
  assunto: AssuntoContato | ''
  mensagem: string
}

/** Mensagem de erro de cada campo. Campo sem erro não aparece no objeto. */
export type ErrosContato = Partial<Record<keyof DadosContato, string>>

/** Em que ponto está o envio: preenchendo o formulário, esperando o envio ou já enviado. */
export type EstadoEnvio = 'preenchendo' | 'enviando' | 'enviado'