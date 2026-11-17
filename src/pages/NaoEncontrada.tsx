import { useRef } from 'react'
import LuzesDaCidade from '../components/LuzesDaCidade'
import BotaoLink from '../components/Botao'

export default function NaoEncontrada() {
  const palco = useRef<HTMLDivElement>(null)
  return (
    <section className="relative isolate flex min-h-[calc(100svh-73px)] items-center overflow-hidden">
      <LuzesDaCidade palavra="404" palcoRef={palco} className="-z-10" />
      <div className="mx-auto w-full max-w-[1320px] px-5 py-16 text-center sm:px-8">
        {/* O "palco": onde as luzes escrevem o 404 */}
        <div ref={palco} aria-hidden="true" className="mx-auto h-[34vw] max-h-[280px] min-h-[120px] max-w-[720px]" />
        <h1 className="titulo mt-8 text-[clamp(2.8rem,8vw,5rem)]">Via sem saída</h1>
        <p className="mx-auto mt-5 max-w-[42ch] text-mudo">
          Esse endereço não leva a lugar nenhum no Zela. Confira o link ou volte para o começo.
        </p>
        <BotaoLink para="/" className="mt-8">Voltar ao início</BotaoLink>
      </div>
    </section>
  )
}