import { useRef } from 'react'
import LuzesDaCidade from '../components/LuzesDaCidade'
import BotaoLink from '../components/Botao'

interface EmObraProps {
  titulo: string
}

/** Página provisória enquanto a tela ainda não foi construída. */
export default function EmObra({ titulo }: EmObraProps) {
  const palco = useRef<HTMLDivElement>(null)
  return (
    <section className="relative isolate overflow-hidden">
      <LuzesDaCidade palavra="EM OBRA" palcoRef={palco} className="-z-10 opacity-60" />
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 md:py-24">
        {/* O "palco": um espaço vazio que marca onde as luzes escrevem a palavra */}
        <div ref={palco} aria-hidden="true" className="h-[22vw] max-h-[180px] min-h-[80px]" />
        <h1 className="titulo mt-10 text-[clamp(2.6rem,7vw,4.5rem)]">{titulo}</h1>
        <p className="mt-5 max-w-[46ch] text-mudo">
          Trecho em obra. Esta página entra nas próximas etapas do projeto.
        </p>
        <BotaoLink para="/" className="mt-8">Voltar ao início</BotaoLink>
      </div>
    </section>
  )
}