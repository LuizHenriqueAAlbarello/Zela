import { useRef } from 'react'
import LuzesDaCidade from '../components/LuzesDaCidade'

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
        </div>
      </section>
    </>
  )
}