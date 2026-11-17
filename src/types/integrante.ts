/** Um integrante do grupo. */
export interface Integrante {
  /** RM da FIAP, só números. Também é o endereço do perfil: /integrantes/572727 */
  rm: string
  nome: string
  turma: string
  /** Foto em public/integrantes (ex.: '/integrantes/572727.jpg'). Sem foto, aparecem as iniciais. */
  foto?: string
  /** Link completo do perfil no GitHub */
  github?: string
  /** Link completo do perfil no LinkedIn */
  linkedin?: string
}