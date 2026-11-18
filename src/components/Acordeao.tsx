import { useId, useState } from 'react'
import type { ItemFaq } from '../types/faq'

interface AcordeaoProps {
  /** Lista de perguntas e respostas */
  itens: ItemFaq[]
}

/**
 * Lista de perguntas que abrem e fecham. Só uma fica aberta por vez.
 * Segue o padrão de acordeão acessível: cada pergunta é um botão dentro de um título,
 * com aria-expanded e aria-controls; cada resposta é uma região ligada à pergunta.
 */
export default function Acordeao({ itens }: AcordeaoProps) {
  // Guarda a posição da pergunta aberta; null quando todas estão fechadas
  const [aberto, setAberto] = useState<number | null>(null)
  // Prefixo único para os ids, caso o componente seja usado mais de uma vez na mesma página
  const prefixo = useId()

  function alternar(indice: number) {
    setAberto((atual) => (atual === indice ? null : indice))
  }

  return (
    <ul className="border-b border-borda">
      {itens.map((item, indice) => {
        const estaAberto = aberto === indice
        const idPergunta = `${prefixo}-pergunta-${indice}`
        const idResposta = `${prefixo}-resposta-${indice}`
        return (
          <li key={item.pergunta} className="border-t border-borda">
            <h3>
              <button
                type="button"
                id={idPergunta}
                aria-expanded={estaAberto}
                aria-controls={idResposta}
                onClick={() => alternar(indice)}
                className="flex min-h-11 w-full items-center justify-between gap-6 py-6 text-left text-[19px] font-semibold text-papel sm:text-[21px]"
              >
                {item.pergunta}
              </button>
            </h3>
            <div id={idResposta} role="region" aria-labelledby={idPergunta} hidden={!estaAberto}>
              <p className="max-w-[65ch] pb-7 text-mudo">{item.resposta}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
