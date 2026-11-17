import { useRef } from 'react'
import LuzesDaCidade from '../components/LuzesDaCidade'
import CartaoIntegrante from '../components/CartaoIntegrante'
import { INTEGRANTES } from '../services/integrantes'

export default function Integrantes() {
  const palco = useRef<HTMLDivElement>(null)
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <LuzesDaCidade palavra="EQUIPE" palcoRef={palco} className="-z-10 opacity-70" />
        <div className="mx-auto max-w-[1320px] px-5 pt-14 pb-10 sm:px-8 md:pt-20">
          <div ref={palco} aria-hidden="true" className="h-[22vw] max-h-[190px] min-h-[80px]" />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_minmax(0,440px)] lg:items-end lg:gap-16">
            <h1 className="titulo animate-chegar text-[clamp(2.6rem,6vw,4.75rem)]">
              Quem mantém <span className="text-sodio">o Zela aceso</span>
            </h1>
            <p className="animate-chegar text-mudo [animation-delay:120ms]">
              Quatro integrantes da turma 1TDSPF da FIAP. Passe o mouse em cada um e clique para ver o perfil completo.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Integrantes do grupo" className="mx-auto max-w-[1320px] px-5 pt-6 pb-24 sm:px-8 md:pb-32">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INTEGRANTES.map((integrante, i) => (
            <li key={integrante.rm}>
              <CartaoIntegrante integrante={integrante} indice={i} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}