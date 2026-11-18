import { useRef } from 'react'
import LuzesDaCidade from '../components/LuzesDaCidade'

/** Um número de destaque com a explicação e a fonte de onde ele veio. */
interface Numero {
  valor: string
  descricao: string
  fonte: string
}

const NUMEROS: Numero[] = [
  {
    valor: '157 mil',
    descricao: 'solicitações por mês chegam, em média, ao SP156, o canal de atendimento da cidade.',
    fonte: 'Prefeitura de São Paulo, 2022',
  },
  {
    valor: '14%',
    descricao: 'dos pedidos do 1º semestre de 2019 foram de reparo de asfalto, o assunto mais pedido.',
    fonte: 'Câmara Municipal de São Paulo, 2019',
  },
]

/** Uma pergunta que a IA do Zela responde sobre cada chamado. */
interface PerguntaIa {
  pergunta: string
  resposta: string
}

const PERGUNTAS_IA: PerguntaIa[] = [
  {
    pergunta: 'Quanto tempo vai levar?',
    resposta:
      'A IA estima o prazo previsto de cada chamado a partir da categoria e do histórico de pedidos parecidos. Quem abriu sabe quando esperar uma resposta.',
  },
  {
    pergunta: 'O que é mais urgente?',
    resposta:
      'Cada chamado recebe uma prioridade de 1 a 5. Ela começa no peso da categoria (uma árvore com risco pesa mais que um poste apagado) e sobe conforme os vizinhos apoiam.',
  },
  {
    pergunta: 'Onde a cidade demora mais?',
    resposta:
      'Juntando os prazos por região, a IA aponta as zonas críticas: os bairros que esperam mais. Assim a subprefeitura enxerga onde precisa agir primeiro.',
  },
]

/** Página Sobre: por que o Zela existe, para quem ele é e com o que foi feito. */
export default function Sobre() {
  const palco = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* Cabeçalho: as luzes da cidade escrevem "SOBRE" no espaço do palco */}
      <section className="relative isolate overflow-hidden">
        <LuzesDaCidade palavra="SOBRE" palcoRef={palco} className="-z-10 opacity-70" />
        <div className="mx-auto max-w-[1320px] px-5 pt-14 pb-10 sm:px-8 md:pt-20">
          <div ref={palco} aria-hidden="true" className="h-[22vw] max-h-[190px] min-h-[80px]" />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_minmax(0,440px)] lg:items-end lg:gap-16">
            <h1 className="titulo animate-chegar text-[clamp(2.6rem,6vw,4.75rem)]">
              Por que o <span className="text-sodio">Zela existe</span>
            </h1>
            <p className="animate-chegar text-mudo [animation-delay:120ms]">
              Uma plataforma de zeladoria colaborativa para São Paulo. O cidadão registra o problema da rua, os
              vizinhos apoiam e a cidade responde com prazo e prioridade à vista de todos.
            </p>
          </div>
        </div>
      </section>

      {/* O problema: por que a zeladoria de hoje não dá conta */}
      <section aria-labelledby="titulo-problema" className="border-t border-borda bg-noite-2">
        <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <h2 id="titulo-problema" className="titulo text-[clamp(2.3rem,5vw,3.75rem)]">
              O pedido some no meio do caminho
            </h2>
            <div className="max-w-[60ch] space-y-5 text-mudo">
              <p>
                Quem vê um buraco, um poste apagado ou entulho na calçada nem sempre sabe onde reclamar. O pedido
                vai para um canal, depois para outro, e se perde no caminho.
              </p>
              <p>
                Quando chega, entra numa fila sem prioridade clara, e o cidadão quase nunca recebe retorno sobre o
                que aconteceu com ele. Sem resposta, as pessoas param de avisar, e o problema fica na rua.
              </p>
              <p className="text-papel">
                O Zela junta os pedidos num lugar só, mostra o que é mais urgente e deixa o andamento à vista do
                bairro inteiro.
              </p>
            </div>
          </div>

          {/* Os números que mostram o tamanho do problema, com a fonte de cada um */}
          <ul className="mt-16 grid gap-10 border-t border-borda pt-10 sm:grid-cols-2 sm:gap-8 md:mt-20">
            {NUMEROS.map((item) => (
              <li key={item.valor}>
                <p className="titulo numeros text-[clamp(3rem,8vw,5.5rem)] text-sodio">{item.valor}</p>
                <p className="mt-4 max-w-[40ch] text-papel">{item.descricao}</p>
                <p className="mt-2 text-sm text-mudo">Fonte: {item.fonte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* As 3 perguntas da IA: lista vertical, pergunta grande à esquerda e resposta à direita */}
      <section aria-labelledby="titulo-ia" className="border-t border-borda">
        <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
          <h2 id="titulo-ia" className="titulo max-w-[18ch] text-[clamp(2.3rem,5vw,3.75rem)]">
            Três perguntas que a IA responde
          </h2>
          <p className="mt-6 max-w-[50ch] text-mudo">Para cada chamado aberto, a IA do Zela ajuda a responder:</p>

          <dl className="mt-12 md:mt-16">
            {PERGUNTAS_IA.map((item) => (
              <div
                key={item.pergunta}
                className="grid gap-4 border-t border-borda py-8 md:grid-cols-2 md:gap-16 md:py-10"
              >
                <dt className="titulo text-[22px] sm:text-[26px]">{item.pergunta}</dt>
                <dd className="max-w-[55ch] text-mudo">{item.resposta}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}