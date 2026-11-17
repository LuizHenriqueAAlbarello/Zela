import type { Integrante } from '../types/integrante'
import { iniciais } from '../services/integrantes'

interface AvatarIntegranteProps {
  integrante: Integrante
  /** Tamanho em Tailwind (ex.: 'size-28') */
  tamanho?: string
  /** Aceso: colorido e com brilho. Apagado: em preto e branco (acende no hover do card). */
  aceso?: boolean
}

/**
 * Foto do integrante dentro de um anel de luz. Sem foto, mostra as iniciais.
 * Usado no card da lista e no perfil.
 */
export default function AvatarIntegrante({ integrante, tamanho = 'size-28', aceso = false }: AvatarIntegranteProps) {
  const anel = aceso
    ? 'ring-sodio shadow-[0_0_48px_-6px_rgba(255,154,60,.7)]'
    : 'ring-borda group-hover:ring-sodio group-hover:shadow-[0_0_48px_-6px_rgba(255,154,60,.7)] group-focus-within:ring-sodio'

  return (
    <span
      className={`relative grid ${tamanho} shrink-0 place-items-center overflow-hidden rounded-full bg-noite-3 ring-2 ring-offset-4 ring-offset-noite-2 transition-[box-shadow,--tw-ring-color] duration-500 ${anel}`}
    >
      {integrante.foto ? (
        <img
          src={integrante.foto}
          alt={`Foto de ${integrante.nome}`}
          loading="lazy"
          className={`size-full object-cover transition-[filter,transform] duration-700 ease-saida ${
            aceso
              ? ''
              : 'grayscale group-hover:scale-105 group-hover:grayscale-0 group-focus-within:grayscale-0 [@media(hover:none)]:grayscale-0'
          }`}
        />
      ) : (
        <span aria-hidden="true" className="titulo text-[clamp(1.6rem,3vw,2.6rem)] text-mudo transition-colors duration-500 group-hover:text-sodio">
          {iniciais(integrante.nome)}
        </span>
      )}
    </span>
  )
}