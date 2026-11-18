import type { AssuntoContato } from '../types/contato'

/** Opções do campo "Assunto": o valor guardado e o texto que aparece na tela. */
export const ASSUNTOS_CONTATO: { valor: AssuntoContato; rotulo: string }[] = [
  { valor: 'duvida', rotulo: 'Dúvida' },
  { valor: 'sugestao', rotulo: 'Sugestão' },
  { valor: 'problema', rotulo: 'Problema no site' },
  { valor: 'imprensa', rotulo: 'Imprensa' },
]

/** Tamanho mínimo da mensagem, em caracteres. */
export const MINIMO_MENSAGEM = 20
