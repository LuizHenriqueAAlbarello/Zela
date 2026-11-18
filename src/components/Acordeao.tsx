import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
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
                className={`flex min-h-11 w-full items-center justify-between gap-6 py-6 text-left text-[19px] font-semibold transition-colors duration-200 hover:text-sodio sm:text-[21px] ${
                  estaAberto ? 'text-sodio' : 'text-papel'
                }`}
              >
                {item.pergunta}
                {/* O "+" gira 45° e vira um "x" quando a resposta está aberta */}
                <Plus
                  aria-hidden="true"
                  strokeWidth={2.4}
                  className={`size-6 shrink-0 transition-transform duration-300 ${estaAberto ? 'rotate-45' : ''}`}
                />
              </button>
            </h3>
            {/*
              Animação de altura: a grade vai de 0fr (linha fechada) a 1fr (altura do conteúdo).
              "inert" tira a resposta fechada do Tab e dos leitores de tela, já que ela continua no HTML.
            */}
            <div
              id={idResposta}
              role="region"
              aria-labelledby={idPergunta}
              inert={!estaAberto}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                estaAberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[65ch] pb-7 text-mudo">{item.resposta}</p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
