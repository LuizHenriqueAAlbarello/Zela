import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import LuzesDaCidade from '../components/LuzesDaCidade'
import AvatarIntegrante from '../components/AvatarIntegrante'
import LinksIntegrante from '../components/LinksIntegrante'
import CartaoIntegrante from '../components/CartaoIntegrante'
import BotaoLink from '../components/Botao'
import { INTEGRANTES, buscarIntegrante, primeiroNome } from '../services/integrantes'

export default function PerfilIntegrante() {
  // O :rm da rota /integrantes/:rm
  const { rm = '' } = useParams<{ rm: string }>()
  const integrante = buscarIntegrante(rm)
  const palco = useRef<HTMLDivElement>(null)

  // RM que não existe: estado "não encontrado"
  if (!integrante) {
    return (
      <section className="mx-auto flex min-h-[70svh] max-w-[1320px] flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
        <h1 className="titulo text-[clamp(2.4rem,7vw,4.5rem)]">Integrante não encontrado</h1>
        <p className="mt-5 max-w-[44ch] text-mudo">
          Ninguém do grupo tem o RM <span className="numeros font-semibold text-papel">{rm}</span>. Confira o endereço ou veja a equipe completa.
        </p>
        <BotaoLink para="/integrantes" className="mt-8">Ver a equipe</BotaoLink>
      </section>
    )
  }

  const outros = INTEGRANTES.filter((i) => i.rm !== integrante.rm)

  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* As luzes da cidade escrevem o primeiro nome da pessoa */}
        <LuzesDaCidade palavra={primeiroNome(integrante.nome).toUpperCase()} palcoRef={palco} className="-z-10 opacity-60" />

        <div className="mx-auto max-w-[1320px] px-5 pt-10 pb-20 sm:px-8 md:pb-28">
          <Link
            to="/integrantes"
            className="inline-flex items-center gap-2 py-2 text-[15px] font-semibold text-mudo no-underline hover:text-papel"
          >
            <ArrowLeft className="size-4" strokeWidth={2.4} aria-hidden="true" /> Voltar para a equipe
          </Link>

          <div ref={palco} aria-hidden="true" className="mt-6 h-[22vw] max-h-[200px] min-h-[80px]" />

          <div className="mt-10 flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
            <div className="animate-chegar">
              <AvatarIntegrante integrante={integrante} tamanho="size-40 md:size-48" aceso />
            </div>
            <div className="animate-chegar [animation-delay:120ms]">
              <h1 className="titulo text-[clamp(2.2rem,5vw,4rem)]">{integrante.nome}</h1>
              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
                <div className="flex gap-2">
                  <dt className="text-mudo">RM</dt>
                  <dd className="numeros font-semibold">{integrante.rm}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-mudo">Turma</dt>
                  <dd className="font-semibold">{integrante.turma}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-mudo">Instituição</dt>
                  <dd className="font-semibold">FIAP</dd>
                </div>
              </dl>
              <LinksIntegrante integrante={integrante} className="mt-7" />
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Outros integrantes" className="border-t border-borda bg-noite-2">
        <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 md:py-24">
          <h2 className="titulo text-[clamp(1.8rem,3.6vw,2.6rem)]">O resto da equipe</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outros.map((i, n) => (
              <li key={i.rm}>
                <CartaoIntegrante integrante={i} indice={n} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}