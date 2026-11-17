import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import LuzesDaCidade from '../components/LuzesDaCidade'
import Letreiro from '../components/Letreiro'
import Garoa from '../components/Garoa'
import CaminhoLuz, { type Parada } from '../components/CaminhoLuz'
import { CHAMADOS_RECENTES } from '../services/dadosExemplo'
import { CATEGORIAS } from '../services/categorias'
import type { CategoriaId } from '../types/chamado'

/** As quatro etapas que todo chamado percorre. */
const CAMINHO: Parada[] = [
  { status: 'ABERTO', quem: 'Você registra', texto: 'Categoria, endereço e uma foto. Leva menos de um minuto e o protocolo sai na hora.' },
  { status: 'EM_ANALISE', quem: 'A IA prioriza', texto: 'Prevê o prazo e o risco de atraso. Quanto mais vizinhos apoiam, mais o chamado sobe na fila.' },
  { status: 'EM_EXECUCAO', quem: 'A equipe vai', texto: 'A subprefeitura manda a equipe e registra cada etapa no histórico.' },
  { status: 'RESOLVIDO', quem: 'Você avalia', texto: 'Com o serviço feito, você dá uma nota de 1 a 5 para o atendimento.' },
]

/** Erros possíveis do mini formulário (um por campo). */
interface ErrosMini {
  endereco?: string
}

/** Primeiro passo do chamado: o quê e onde. O resto é preenchido em /chamados/novo. */
function MiniFormulario() {
  const navegar = useNavigate()
  const [categoria, setCategoria] = useState<CategoriaId>('BURACO')
  const [endereco, setEndereco] = useState<string>('')
  const [erros, setErros] = useState<ErrosMini>({})

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const limpo = endereco.trim()

    // Validação antes de seguir
    if (limpo.length < 5) {
      setErros({ endereco: limpo ? 'Escreva a rua e o número.' : 'Diga onde fica o problema.' })
      return
    }

    setErros({})
    // Leva a categoria e o endereço para o formulário completo, pela URL
    const busca = new URLSearchParams({ categoria, endereco: limpo })
    navegar(`/chamados/novo?${busca.toString()}`)
  }

  const campo =
    'h-12 w-full rounded-xl border border-borda bg-noite px-3.5 text-base text-papel transition-colors ' +
    'hover:border-[#3a4050] focus-visible:border-sodio focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sodio/40'

  return (
    <form
      onSubmit={enviar}
      noValidate
      className="mt-9 rounded-2xl border border-borda bg-noite-2 p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr_auto] sm:items-start">
        <div>
          <label htmlFor="mini-categoria" className="mb-1.5 block text-[13px] font-semibold text-mudo">
            O que aconteceu?
          </label>
          <select
            id="mini-categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaId)}
            className={campo}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mini-endereco" className="mb-1.5 block text-[13px] font-semibold text-mudo">
            Onde?
          </label>
          <input
            id="mini-endereco"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua e número"
            autoComplete="street-address"
            aria-invalid={Boolean(erros.endereco)}
            aria-describedby={erros.endereco ? 'mini-endereco-erro' : undefined}
            className={`${campo} ${erros.endereco ? 'border-erro' : ''}`}
          />
          {erros.endereco && (
            <p id="mini-endereco-erro" role="alert" className="mt-1.5 text-sm font-semibold text-erro">
              {erros.endereco}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="rotulo flex h-12 items-center justify-center gap-2 rounded-xl bg-sodio px-5 text-[14px] text-noite shadow-[0_8px_30px_-8px_rgba(255,154,60,.6)] transition-colors hover:bg-[#ffb066] sm:mt-[27px]"
        >
          Continuar <ArrowRight className="size-[18px]" strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}

function Hero() {
  const palco = useRef<HTMLDivElement>(null)
  return (
    <section className="relative isolate flex min-h-[calc(100svh-73px)] overflow-hidden lg:items-center">
      <LuzesDaCidade palavra="ZELA" palcoRef={palco} className="-z-20" />

      {/* Escurece atrás do texto para manter a leitura sobre as luzes */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,transparent_22%,rgba(7,8,12,.88)_42%,#07080C_100%)] lg:bg-[linear-gradient(90deg,rgba(7,8,12,.92)_0%,rgba(7,8,12,.75)_36%,transparent_62%)]"
      />

      <div className="mx-auto grid w-full max-w-[1320px] gap-6 px-5 pt-6 pb-16 sm:px-8 lg:grid-cols-[minmax(0,580px)_1fr] lg:gap-6 lg:py-20">
        {/* Palco: no celular fica em cima do texto; no desktop, à direita */}
        <div
          ref={palco}
          aria-hidden="true"
          className="h-[26vw] max-h-[200px] min-h-[100px] lg:order-2 lg:-mr-10 lg:h-[440px] lg:max-h-none"
        />

        <div className="lg:order-1">
          <h1 className="titulo animate-chegar text-[clamp(2.6rem,5.6vw,4.75rem)]">
            Viu um problema na rua? <span className="text-sodio">Avisa o Zela.</span>
          </h1>
          <p className="mt-6 max-w-[46ch] animate-chegar text-lg text-mudo [animation-delay:120ms]">
            Buraco, poste apagado, entulho, árvore com risco. Você registra, os vizinhos apoiam, a IA
            prioriza e a prefeitura resolve, com tudo à vista de quem mora no bairro.
          </p>
          <div className="animate-chegar [animation-delay:240ms]">
            <MiniFormulario />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/chamados"
              className="py-2 font-semibold text-papel underline decoration-sodio decoration-2 hover:text-sodio"
            >
              Ver os chamados perto de você
            </Link>
            <p className="numeros text-[13px] text-mudo">São Paulo · 23°33′S 46°38′O</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Caminho() {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#07080C_0%,#0D0F15_100%)]">
      <Garoa className="-z-10" />
      <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-end lg:gap-16">
          <h2 className="titulo text-[clamp(2.3rem,5vw,3.75rem)]">Do seu celular até a equipe na rua</h2>
          <p className="text-mudo">
            Todo chamado passa pelos mesmos quatro postes. A cada etapa concluída um deles acende,
            e você sempre sabe onde o seu parou, mesmo debaixo de garoa.
          </p>
        </div>
        <div className="mt-16 md:mt-24">
          <CaminhoLuz paradas={CAMINHO} />
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Letreiro chamados={CHAMADOS_RECENTES} />
      <Caminho />
    </>
  )
}