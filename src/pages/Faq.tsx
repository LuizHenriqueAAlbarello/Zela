import { useRef } from 'react'
import LuzesDaCidade from '../components/LuzesDaCidade'
import Acordeao from '../components/Acordeao'
import BotaoLink from '../components/Botao'
import { PERGUNTAS_FAQ } from '../services/faq'

/** Página FAQ: as dúvidas mais comuns sobre o Zela. */
export default function Faq() {
  const palco = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* Título da aba do navegador (o React 19 leva esta tag para o <head> sozinho) */}
      <title>Perguntas frequentes · Zela</title>

      {/* Cabeçalho: as luzes da cidade escrevem "FAQ" no espaço do palco */}
      <section className="relative isolate overflow-hidden">
        <LuzesDaCidade palavra="FAQ" palcoRef={palco} className="-z-10 opacity-70" />
        <div className="mx-auto max-w-[1320px] px-5 pt-14 pb-10 sm:px-8 md:pt-20">
          <div ref={palco} aria-hidden="true" className="h-[22vw] max-h-[190px] min-h-[80px]" />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_minmax(0,440px)] lg:items-end lg:gap-16">
            <h1 className="titulo animate-chegar text-[clamp(2.6rem,6vw,4.75rem)]">
              Perguntas <span className="text-sodio">frequentes</span>
            </h1>
            <p className="animate-chegar text-mudo [animation-delay:120ms]">
              Como abrir um chamado, o que é apoiar, como a prioridade é calculada e o que fazer numa emergência.
            </p>
          </div>
        </div>
      </section>

      {/* As perguntas, uma embaixo da outra, abrindo e fechando */}
      <section aria-labelledby="titulo-perguntas" className="border-t border-borda bg-noite-2">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 md:py-24">
          {/* Título só para leitores de tela: mantém a ordem h1 > h2 > h3 (as perguntas são h3) */}
          <h2 id="titulo-perguntas" className="sr-only">
            Perguntas e respostas
          </h2>
          <div className="max-w-[900px]">
            <Acordeao itens={PERGUNTAS_FAQ} />
          </div>
        </div>
      </section>

      {/* Ajuda: para quem não encontrou a resposta na lista */}
      <section aria-labelledby="titulo-ajuda" className="border-t border-borda">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 id="titulo-ajuda" className="titulo text-[clamp(2.3rem,5vw,3.75rem)]">
              Não achou sua resposta?
            </h2>
            <p className="mt-6 max-w-[50ch] text-mudo">
              Mande sua dúvida para a equipe. Em emergência, não espere: ligue para a Defesa Civil no{' '}
              <span className="numeros font-semibold text-papel">199</span>.
            </p>
          </div>
          <BotaoLink para="/contato" className="justify-self-start">
            Falar com a equipe
          </BotaoLink>
        </div>
      </section>
    </>
  )
}
