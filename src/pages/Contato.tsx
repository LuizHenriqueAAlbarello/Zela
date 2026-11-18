import { useRef } from 'react'
import LuzesDaCidade from '../components/LuzesDaCidade'

/** Página Contato: formulário para falar com a equipe do Zela. */
export default function Contato() {
  const palco = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* Cabeçalho: as luzes da cidade escrevem "CONTATO" no espaço do palco */}
      <section className="relative isolate overflow-hidden">
        <LuzesDaCidade palavra="CONTATO" palcoRef={palco} className="-z-10 opacity-70" />
        <div className="mx-auto max-w-[1320px] px-5 pt-14 pb-10 sm:px-8 md:pt-20">
          <div ref={palco} aria-hidden="true" className="h-[22vw] max-h-[190px] min-h-[80px]" />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_minmax(0,440px)] lg:items-end lg:gap-16">
            <h1 className="titulo animate-chegar text-[clamp(2.6rem,6vw,4.75rem)]">
              Fale com a <span className="text-sodio">equipe</span>
            </h1>
            <p className="animate-chegar text-mudo [animation-delay:120ms]">
              Dúvida, sugestão ou problema no site? Escreva para a gente. Para registrar um problema da rua, use
              "Abrir chamado".
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
