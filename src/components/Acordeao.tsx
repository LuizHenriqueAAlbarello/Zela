import { useState } from 'react'
import type { ItemFaq } from '../types/faq'

interface AcordeaoProps {
  /** Lista de perguntas e respostas */
  itens: ItemFaq[]
}

/** Lista de perguntas que abrem e fecham. Só uma fica aberta por vez. */
export default function Acordeao({ itens }: AcordeaoProps) {
  // Guarda a posição da pergunta aberta; null quando todas estão fechadas
  const [aberto, setAberto] = useState<number | null>(null)

  function alternar(indice: number) {
    setAberto((atual) => (atual === indice ? null : indice))
  }

  return (
    <ul className="border-b border-borda">
      {itens.map((item, indice) => {
        const estaAberto = aberto === indice
        return (
          <li key={item.pergunta} className="border-t border-borda">
            <button
              type="button"
              onClick={() => alternar(indice)}
              className="flex min-h-11 w-full items-center justify-between gap-6 py-6 text-left text-[19px] font-semibold text-papel sm:text-[21px]"
            >
              {item.pergunta}
            </button>
            {estaAberto && <p className="max-w-[65ch] pb-7 text-mudo">{item.resposta}</p>}
          </li>
        )
      })}
    </ul>
  )
}
