import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BotaoLink from '../components/Botao'
import CategoriaIcone from '../components/CategoriaIcone'
import SeloStatus, { rotuloStatus } from '../components/SeloStatus'
import { listarChamados } from '../services/chamados'
import { ehCancelamento, mensagemDoErro } from '../services/api'
import { CATEGORIAS, nomeCategoria } from '../services/categorias'
import type { CategoriaId, Chamado, StatusChamado } from '../types/chamado'

type Ordem = 'prioridade' | 'recentes' | 'apoios'

const STATUS: StatusChamado[] = ['ABERTO', 'EM_ANALISE', 'EM_EXECUCAO', 'RESOLVIDO', 'CANCELADO']

const ENCERRADOS: StatusChamado[] = ['RESOLVIDO', 'CANCELADO']

const CLASSE_CAMPO =
  'min-h-12 w-full rounded-xl border border-borda bg-noite px-4 text-papel outline-none transition-colors focus:border-sodio'

function semAcento(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function formatarData(data: string) {
  const valor = new Date(data)
  if (Number.isNaN(valor.getTime())) return data
  return valor.toLocaleDateString('pt-BR')
}

function ordenar(lista: Chamado[], ordem: Ordem) {
  const copia = [...lista]
  copia.sort((a, b) => {
    if (ordem === 'recentes') return b.criadoEm.localeCompare(a.criadoEm)
    if (ordem === 'apoios') return b.apoios - a.apoios || b.prioridade - a.prioridade
    const aEncerrado = ENCERRADOS.includes(a.status) ? 1 : 0
    const bEncerrado = ENCERRADOS.includes(b.status) ? 1 : 0
    return aEncerrado - bEncerrado || b.prioridade - a.prioridade || b.apoios - a.apoios
  })
  return copia
}

export default function ListaChamados() {
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState<StatusChamado | ''>('')
  const [categoria, setCategoria] = useState<CategoriaId | ''>('')
  const [ordem, setOrdem] = useState<Ordem>('prioridade')

  useEffect(() => {
    const controlador = new AbortController()

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await listarChamados(controlador.signal)
        if (controlador.signal.aborted) return
        setChamados(dados)
      } catch (erroRecebido) {
        if (ehCancelamento(erroRecebido)) return
        setErro(mensagemDoErro(erroRecebido))
      } finally {
        if (!controlador.signal.aborted) setCarregando(false)
      }
    }

    carregar()
    return () => controlador.abort()
  }, [tentativa])

  const visiveis = useMemo(() => {
    const termo = semAcento(busca.trim())
    const filtrados = chamados.filter((chamado) => {
      if (status && chamado.status !== status) return false
      if (categoria && chamado.categoria !== categoria) return false
      if (!termo) return true
      const texto = semAcento(
        `${chamado.bairro} ${chamado.endereco} ${chamado.protocolo ?? ''} ${chamado.id} ${nomeCategoria(chamado.categoria)}`,
      )
      return texto.includes(termo)
    })
    return ordenar(filtrados, ordem)
  }, [chamados, busca, status, categoria, ordem])

  const emAndamento = chamados.filter((chamado) => !ENCERRADOS.includes(chamado.status)).length
  const resolvidos = chamados.filter((chamado) => chamado.status === 'RESOLVIDO').length
  const totalApoios = chamados.reduce((soma, chamado) => soma + chamado.apoios, 0)
  const temFiltro = busca !== '' || status !== '' || categoria !== ''

  function limparFiltros() {
    setBusca('')
    setStatus('')
    setCategoria('')
  }

  return (
    <div className="min-h-screen bg-noite text-papel">
      <section className="border-b border-borda bg-noite-2 px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8">
          <div>
            <p className="rotulo text-sodio">ZELADORIA DA CIDADE</p>
            <h1 className="titulo mt-3 text-4xl md:text-6xl">CHAMADOS</h1>
            <p className="mt-4 max-w-xl text-mudo">
              Veja o que os moradores já registraram, acompanhe o andamento e apoie os
              problemas que você também viu.
            </p>
          </div>
          <BotaoLink para="/chamados/novo">Abrir chamado</BotaoLink>
        </div>

        {!carregando && !erro && (
          <dl className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ['Registrados', chamados.length],
              ['Em andamento', emAndamento],
              ['Resolvidos', resolvidos],
              ['Apoios', totalApoios],
            ].map(([rotulo, valor]) => (
              <div key={rotulo} className="rounded-2xl border border-borda bg-noite p-5">
                <dt className="text-sm text-mudo">{rotulo}</dt>
                <dd className="numeros mt-1 text-3xl text-papel">{valor}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <form
          className="grid gap-4 rounded-2xl border border-borda bg-noite-2 p-5 md:grid-cols-[2fr_1fr_1fr_1fr]"
          onSubmit={(evento) => evento.preventDefault()}
          role="search"
        >
          <label className="flex flex-col gap-2 text-sm text-mudo">
            Buscar
            <input
              type="search"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Bairro, endereço ou protocolo"
              className={CLASSE_CAMPO}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-mudo">
            Status
            <select
              value={status}
              onChange={(evento) => setStatus(evento.target.value as StatusChamado | '')}
              className={CLASSE_CAMPO}
            >
              <option value="">Todos</option>
              {STATUS.map((item) => (
                <option key={item} value={item}>
                  {rotuloStatus(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-mudo">
            Categoria
            <select
              value={categoria}
              onChange={(evento) => setCategoria(evento.target.value as CategoriaId | '')}
              className={CLASSE_CAMPO}
            >
              <option value="">Todas</option>
              {CATEGORIAS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-mudo">
            Ordenar por
            <select
              value={ordem}
              onChange={(evento) => setOrdem(evento.target.value as Ordem)}
              className={CLASSE_CAMPO}
            >
              <option value="prioridade">Prioridade</option>
              <option value="recentes">Mais recentes</option>
              <option value="apoios">Mais apoiados</option>
            </select>
          </label>
        </form>

        {carregando && (
          <p className="py-20 text-center text-mudo" aria-live="polite">
            Carregando chamados... Se a API estava parada, a primeira resposta pode levar até
            1 minuto.
          </p>
        )}

        {!carregando && erro && (
          <div className="mt-10 rounded-2xl border border-borda bg-noite-2 p-8">
            <h2 className="titulo text-2xl">Não foi possível carregar os chamados</h2>
            <p role="alert" className="mt-3 text-mudo">
              {erro}
            </p>
            <button
              type="button"
              onClick={() => setTentativa((valor) => valor + 1)}
              className="rotulo mt-6 inline-flex min-h-12 items-center rounded-full bg-sodio px-6 text-noite"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {!carregando && !erro && (
          <>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-mudo" aria-live="polite">
                {visiveis.length === 1
                  ? '1 chamado encontrado'
                  : `${visiveis.length} chamados encontrados`}
              </p>
              {temFiltro && (
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="text-sm text-sodio hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {visiveis.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-borda p-10 text-center">
                <p className="text-mudo">
                  {chamados.length === 0
                    ? 'Nenhum chamado registrado ainda.'
                    : 'Nenhum chamado combina com esses filtros.'}
                </p>
              </div>
            ) : (
              <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visiveis.map((chamado) => (
                  <li key={chamado.id}>
                    <Link
                      to={`/chamados/${chamado.id}`}
                      className="group flex h-full flex-col rounded-2xl border border-borda bg-noite-2 p-5 no-underline transition-colors hover:border-sodio"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-borda bg-noite text-sodio">
                          <CategoriaIcone categoria={chamado.categoria} className="size-6" />
                        </span>
                        <SeloStatus status={chamado.status} />
                      </div>

                      <h2 className="mt-4 font-semibold text-papel group-hover:text-sodio">
                        {nomeCategoria(chamado.categoria)}
                      </h2>
                      <p className="mt-1 text-sm text-mudo">
                        {chamado.endereco} · {chamado.bairro}
                      </p>
                      <p className="mt-3 mb-4 line-clamp-2 text-sm text-papel/80">{chamado.descricao}</p>

                      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-borda pt-4 text-xs text-mudo">
                        <span className="numeros">#{chamado.protocolo ?? chamado.id}</span>
                        <span>Prioridade {chamado.prioridade}</span>
                        <span>
                          {chamado.apoios} {chamado.apoios === 1 ? 'apoio' : 'apoios'}
                        </span>
                        <span>{formatarData(chamado.criadoEm)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  )
}
