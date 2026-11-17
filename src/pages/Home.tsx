import { useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import LuzesDaCidade from '../components/LuzesDaCidade'
import Letreiro from '../components/Letreiro'
import Garoa from '../components/Garoa'
import MapaCalor from '../components/MapaCalor'
import CaminhoLuz, { type Parada } from '../components/CaminhoLuz'
import SeloStatus from '../components/SeloStatus'
import CategoriaIcone from '../components/CategoriaIcone'
import BotaoLink from '../components/Botao'
import { useRevelar } from '../hooks/useRevelar'
import { CHAMADOS_RECENTES, TEMPO_POR_ZONA } from '../services/dadosExemplo'
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

function Espera() {
  const maximo = Math.max(...TEMPO_POR_ZONA.map((z) => z.dias))

  // Cor da barra conforme a espera
  const corDa = (dias: number) =>
    dias >= 10.5
      ? 'bg-[linear-gradient(90deg,#FF7A1A,#FF9A3C)] shadow-[0_0_16px_rgba(255,122,26,.55)]'
      : dias >= 9
        ? 'bg-ambar/80'
        : 'bg-verde/75'

  return (
    <section className="relative isolate overflow-hidden border-t border-borda bg-noite-2">
      <MapaCalor className="-z-10" />
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <h2 className="titulo text-[clamp(2.3rem,5vw,3.75rem)]">Na periferia, a espera é maior</h2>
          <p className="mt-6 max-w-[46ch] text-mudo">
            O Zela agrupa os chamados por zona de atendimento e mostra onde a cidade demora mais.
            No protótipo, os bairros do extremo esperam perto de <strong className="numeros text-papel">11 dias</strong>;
            os centrais, <strong className="numeros text-papel">8</strong>.
          </p>
          <p className="mt-8 text-[13px] text-mudo">Tempo médio de resolução por zona. Dados simulados do protótipo.</p>
        </div>

        <figure data-revela className="rounded-3xl border border-borda bg-noite-2/85 p-6 sm:p-8">
          <figcaption className="sr-only">Tempo médio de resolução, em dias, por zona</figcaption>
          <ul className="space-y-5">
            {TEMPO_POR_ZONA.map((z, i) => (
              <li
                key={z.zona}
                className="grid grid-cols-[6.5rem_1fr_3.25rem] items-center gap-4 text-[14px] sm:grid-cols-[10rem_1fr_3.5rem]"
              >
                <span className="leading-tight font-medium">{z.bairro}</span>
                <span className="h-2 rounded-full bg-noite-3">
                  <span
                    className={`barra block h-full origin-left rounded-full ${corDa(z.dias)}`}
                    style={{ width: `${(z.dias / maximo) * 100}%`, '--atraso': `${i * 70}ms` } as CSSProperties}
                  />
                </span>
                <span className="numeros text-right font-semibold">{z.dias.toFixed(1).replace('.', ',')} d</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-mudo">
            <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-sodio" />Crítica</span>
            <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-ambar/80" />Média</span>
            <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-verde/75" />Dentro do prazo</span>
          </div>
        </figure>
      </div>
    </section>
  )
}

function Apoio() {
  const apoios = 23
  // Regra RN04: o buraco começa com peso 4 e sobe 1 nível a cada 5 apoios (máximo 5)
  const prioridade = Math.min(5, 4 + Math.floor(apoios / 5))
  return (
    <section className="border-t border-borda bg-noite">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="lg:order-2">
          <h2 className="titulo text-[clamp(2.3rem,5vw,3.75rem)]">Já tem chamado? Apoie em vez de repetir.</h2>
          <p className="mt-6 max-w-[50ch] text-mudo">
            Se o buraco já está no mapa, um toque em <strong className="text-papel">Eu também vi</strong> vale mais
            que um chamado novo. A cada cinco apoios a prioridade sobe um nível, e a prefeitura enxerga
            quantas pessoas passam pelo problema.
          </p>
        </div>

        <article className="relative overflow-hidden rounded-3xl border border-borda bg-noite-2 lg:order-1">
          {/* Brilho de poste no canto do cartão */}
          <div aria-hidden="true" className="absolute -top-24 -right-16 size-72 rounded-full bg-sodio/20 blur-3xl" />
          <header className="relative flex flex-wrap items-center justify-between gap-3 border-b border-borda px-6 py-5">
            <p className="rotulo text-[15px]"><span className="numeros text-mudo">#0412</span> · Buraco na via</p>
            <SeloStatus status="EM_EXECUCAO" />
          </header>
          <div className="relative px-6 py-6">
            <p className="text-[15px] text-mudo">Rua Dona Belmira Marin, 1200 · Grajaú</p>
            <dl className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <dt className="text-[13px] font-semibold text-mudo">Apoios</dt>
                <dd className="numeros titulo mt-1 text-[52px]">{apoios}</dd>
              </div>
              <div>
                <dt className="text-[13px] font-semibold text-mudo">Prioridade</dt>
                <dd className="mt-3 flex flex-wrap items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      aria-hidden="true"
                      className={`h-5 w-2.5 rounded-full ${n <= prioridade ? 'bg-sodio shadow-[0_0_10px_rgba(255,154,60,.7)]' : 'bg-noite-3'}`}
                    />
                  ))}
                  <span className="numeros ml-2 font-semibold whitespace-nowrap">{prioridade} de 5</span>
                </dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-borda pt-6">
              <BotaoLink para="/chamados/412">Eu também vi</BotaoLink>
              <span className="text-[14px] text-mudo">Previsão da IA: <strong className="numeros text-papel">6 dias</strong></span>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

function Categorias() {
  return (
    <section className="border-t border-borda bg-noite-2">
      <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
        <h2 className="titulo text-[clamp(2.3rem,5vw,3.75rem)]">O que dá pra registrar</h2>
        <ul className="mt-14 flex flex-wrap justify-center gap-x-4 gap-y-10">
          {CATEGORIAS.map((c) => (
            // 2 por linha no celular, 4 no tablet e as 7 numa linha só no desktop
            <li key={c.id} className="w-[calc(50%-8px)] sm:w-[calc(25%-12px)] lg:w-[calc((100%-96px)/7)]">
              <Link
                to={`/chamados/novo?categoria=${c.id}`}
                className="group flex flex-col items-center gap-4 rounded-2xl py-2 text-center text-papel no-underline"
              >
                {/* O círculo "acende" como um poste quando o mouse passa */}
                <span className="grid size-20 place-items-center rounded-full border border-borda bg-noite text-mudo transition-[color,border-color,box-shadow,background-color] duration-300 group-hover:border-sodio group-hover:bg-sodio/10 group-hover:text-sodio group-hover:shadow-[0_0_36px_-4px_rgba(255,154,60,.55)] group-focus-visible:border-sodio group-focus-visible:text-sodio">
                  <CategoriaIcone categoria={c.id} className="size-8" />
                </span>
                <span className="text-[15px] leading-snug font-semibold">
                  {c.nome}
                  <span className="mt-0.5 block text-[13px] font-normal text-mudo">
                    prazo: até <span className="numeros">{c.prazoDias}</span> dias
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Home() {
  useRevelar()
  return (
    <>
      <Hero />
      <Letreiro chamados={CHAMADOS_RECENTES} />
      <Caminho />
      <Espera />
      <Apoio />
      <Categorias />
    </>
  )
}