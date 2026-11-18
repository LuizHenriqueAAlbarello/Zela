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
    </>
  )
}