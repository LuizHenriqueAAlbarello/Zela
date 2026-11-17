import type { Integrante } from '../types/integrante'

// Cada integrante preenche a própria foto, GitHub e LinkedIn (e faz o próprio commit).
// A foto vai em public/integrantes/ com o RM no nome, ex.: public/integrantes/572727.jpg
export const INTEGRANTES: Integrante[] = [
  {
    rm: '572727',
    nome: 'Luiz Henrique Alves Albarello',
    turma: '1TDSPF',
    foto: '',
    github: '',
    linkedin: '',
  },
  {
    rm: '570469',
    nome: 'Matheus Rodrigues Serrão',
    turma: '1TDSPF',
    foto: '',
    github: '',
    linkedin: '',
  },
  {
    rm: '571844',
    nome: 'Vinicius Silveira Espósito',
    turma: '1TDSPF',
    foto: '',
    github: '',
    linkedin: '',
  },
  {
    rm: '573347',
    nome: 'Lucas Luque Cabral',
    turma: '1TDSPF',
    foto: '',
    github: '',
    linkedin: '',
  },
]

/** Procura um integrante pelo RM. Devolve undefined se o RM não existir. */
export function buscarIntegrante(rm: string): Integrante | undefined {
  return INTEGRANTES.find((i) => i.rm === rm)
}

/** "Luiz Henrique Alves Albarello" vira "LA" (primeiro e último nome). */
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

/** "Luiz Henrique Alves Albarello" vira "Luiz". */
export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? nome
}