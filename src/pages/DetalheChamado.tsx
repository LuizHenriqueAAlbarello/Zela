import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import CaminhoLuz from '../components/CaminhoLuz'
import SeloStatus from '../components/SeloStatus'
import {
  buscarChamado,
  listarAtualizacoes,
  apoiarChamado,
} from '../services/chamados'
import {
  ErroApi,
  ehCancelamento,
  mensagemDoErro,
} from '../services/api'
import { nomeCategoria } from '../services/categorias'
import { esquecerCidadao, obterCidadaoId } from '../services/cidadaos'
import type {
  Atualizacao,
  Chamado,
} from '../types/chamado'

const paradas = [
  {
    status: 'ABERTO' as const,
    quem: 'Chamado recebido',
    texto: 'Sua solicitação foi registrada no sistema.',
  },
  {
    status: 'EM_ANALISE' as const,
    quem: 'Em análise',
    texto: 'A equipe responsável está avaliando o problema.',
  },
  {
    status: 'EM_EXECUCAO' as const,
    quem: 'Em execução',
    texto: 'O serviço está sendo realizado pela equipe responsável.',
  },
  {
    status: 'RESOLVIDO' as const,
    quem: 'Resolvido',
    texto: 'O problema foi solucionado.',
  },
]

function formatarData(data: string) {
  const valor = new Date(data)

  if (Number.isNaN(valor.getTime())) return data

  return valor.toLocaleString('pt-BR')
}

export default function DetalheChamado() {
  const { id } = useParams()

  const [chamado, setChamado] = useState<Chamado | null>(null)
  const [atualizacoes, setAtualizacoes] = useState<Atualizacao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [carregandoApoio, setCarregandoApoio] = useState(false)
  const [apoiado, setApoiado] = useState(false)
  const [mensagemApoio, setMensagemApoio] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    async function carregarDados() {
      const numeroId = Number(id)

      setChamado(null)
      setAtualizacoes([])
      setErro('')
      setCarregando(true)

      if (!id || !Number.isInteger(numeroId) || numeroId <= 0) {
        setErro('O número do chamado é inválido.')
        setCarregando(false)
        return
      }

      try {
        const dadosChamado = await buscarChamado(
          numeroId,
          controlador.signal,
        )

        if (controlador.signal.aborted) return

        setChamado(dadosChamado)

        try {
          const historico = await listarAtualizacoes(
            numeroId,
            controlador.signal,
          )

          if (controlador.signal.aborted) return

          setAtualizacoes(historico)
        } catch (erroHistorico) {
          if (ehCancelamento(erroHistorico)) return

          setAtualizacoes([])
        }
      } catch (erroRecebido) {
        if (ehCancelamento(erroRecebido)) return

        if (erroRecebido instanceof ErroApi && erroRecebido.status === 404) {
          setErro('Chamado não encontrado.')
        } else {
          setErro(mensagemDoErro(erroRecebido))
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCarregando(false)
        }
      }
    }

    carregarDados()

    return () => controlador.abort()
  }, [id])

  async function handleApoiar() {
    if (!chamado) return

    setCarregandoApoio(true)
    setMensagemApoio('')

    try {
      try {
        await apoiarChamado(chamado.id, await obterCidadaoId())
      } catch (erroApoio) {
        if (!(erroApoio instanceof ErroApi && erroApoio.status === 400)) throw erroApoio
        esquecerCidadao()
        await apoiarChamado(chamado.id, await obterCidadaoId())
      }
      setApoiado(true)
      setMensagemApoio('Seu apoio foi registrado com sucesso!')
      try {
        setChamado(await buscarChamado(chamado.id))
      } catch {
        setChamado((atual) => (atual ? { ...atual, apoios: atual.apoios + 1 } : atual))
      }
    } catch (erroRecebido) {
      if (erroRecebido instanceof ErroApi && erroRecebido.status === 409) {
        setMensagemApoio(
          'Você já apoiou este chamado ou é a pessoa que o registrou.',
        )
      } else {
        setMensagemApoio(mensagemDoErro(erroRecebido))
      }
    } finally {
      setCarregandoApoio(false)
    }
  }

  const indiceAtual = chamado
    ? paradas.findIndex((parada) => parada.status === chamado.status)
    : -1

  if (carregando) {
    return (
      <div className="min-h-screen bg-noite px-6 py-20 text-center text-papel">
        <p className="text-mudo">Carregando informações do chamado...</p>
      </div>
    )
  }

  if (erro || !chamado) {
    return (
      <div className="min-h-screen bg-noite px-6 py-20 text-papel">
        <div className="mx-auto max-w-2xl rounded-2xl border border-borda bg-noite-2 p-8">
          <h1 className="titulo text-3xl">
            {erro === 'Chamado não encontrado.'
              ? 'Chamado não encontrado'
              : 'Não foi possível carregar'}
          </h1>

          <p role="alert" className="mt-4 text-mudo">
            {erro || 'Chamado não encontrado.'}
          </p>

          <Link
            to="/chamados"
            className="rotulo mt-8 inline-flex rounded-full bg-sodio px-6 py-3 text-noite"
          >
            Voltar para chamados
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-noite text-papel">
      <section className="border-b border-borda bg-noite-2 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/chamados"
            className="text-sm text-mudo hover:text-sodio"
          >
            ← Voltar para chamados
          </Link>

          <p className="rotulo mt-8 text-sodio">ACOMPANHAMENTO</p>

          <h1 className="titulo mt-3 text-4xl md:text-6xl">
            DETALHE DO CHAMADO
          </h1>

          <p className="mt-4 text-mudo">
            Acompanhe as informações e o andamento da solicitação.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-12 px-6 py-12">
        <div className="rounded-2xl border border-borda bg-noite-2 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-mudo">Protocolo</p>
              <h2 className="numeros mt-1 text-2xl">
                #{chamado.id}
              </h2>
            </div>

            <SeloStatus status={chamado.status} tamanho="md" />
          </div>

          <div className="mt-8 grid gap-6 border-t border-borda pt-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-mudo">Categoria</p>
              <p className="mt-2 font-semibold">
                {nomeCategoria(chamado.categoria)}
              </p>
            </div>

            <div>
              <p className="text-sm text-mudo">Endereço</p>
              <p className="mt-2 font-semibold">{chamado.endereco}</p>
            </div>

            <div>
              <p className="text-sm text-mudo">Bairro</p>
              <p className="mt-2 font-semibold">{chamado.bairro}</p>
            </div>

            <div>
              <p className="text-sm text-mudo">Data de abertura</p>
              <p className="mt-2 font-semibold">
                {formatarData(chamado.criadoEm)}
              </p>
            </div>

            <div>
              <p className="text-sm text-mudo">Prioridade</p>
              <p className="mt-2 font-semibold">{chamado.prioridade}</p>
            </div>

            {chamado.prazoPrevistoDias != null && (
              <div>
                <p className="text-sm text-mudo">Prazo previsto</p>
                <p className="mt-2 font-semibold">
                  {chamado.prazoPrevistoDias} dias
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-borda pt-6">
            <p className="text-sm text-mudo">Descrição do problema</p>
            <p className="mt-2 leading-relaxed">{chamado.descricao}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-borda pt-6">
            <div>
              <p className="text-sm text-mudo">Apoios da comunidade</p>
              <p className="numeros mt-1 text-2xl">{chamado.apoios}</p>
            </div>

            {chamado.status !== 'RESOLVIDO' &&
              chamado.status !== 'CANCELADO' && (
                <button
                  type="button"
                  onClick={handleApoiar}
                  disabled={carregandoApoio || apoiado}
                  className="rotulo min-h-12 rounded-full bg-sodio px-7 text-noite transition hover:bg-[#ffb066] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {carregandoApoio
                    ? 'Registrando...'
                    : apoiado
                      ? 'Chamado apoiado'
                      : 'Eu também vi'}
                </button>
              )}
          </div>

          {mensagemApoio && (
            <p role="status" className="mt-4 text-sm text-mudo">
              {mensagemApoio}
            </p>
          )}
        </div>

        <div>
          <p className="rotulo text-sodio">ANDAMENTO</p>
          <h2 className="titulo mt-3 text-3xl">
            O CAMINHO DA SOLUÇÃO
          </h2>

          {chamado.status === 'CANCELADO' ? (
            <p className="mt-8 rounded-xl border border-borda bg-noite-2 p-6 text-mudo">
              Este chamado foi cancelado.
            </p>
          ) : (
            <div className="mt-10">
              <CaminhoLuz
                paradas={paradas}
                atual={Math.max(0, indiceAtual)}
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-borda bg-noite-2 p-6">
          <p className="rotulo text-sodio">ANÁLISE INTELIGENTE</p>
          <h2 className="titulo mt-3 text-2xl">
            ANÁLISE DO PROBLEMA
          </h2>

          <p className="mt-4 leading-relaxed text-mudo">
            A análise inteligente será exibida aqui quando essa informação
            estiver disponível na API.
          </p>
        </div>

        <div>
          <p className="rotulo text-sodio">HISTÓRICO</p>
          <h2 className="titulo mt-3 text-3xl">
            ATUALIZAÇÕES DO CHAMADO
          </h2>

          {atualizacoes.length === 0 ? (
            <div className="mt-6 rounded-xl border border-borda p-6">
              <p className="text-mudo">
                Nenhuma atualização foi registrada até o momento.
              </p>
            </div>
          ) : (
            <ol className="mt-6 space-y-4">
              {atualizacoes.map((atualizacao) => (
                <li
                  key={atualizacao.id}
                  className="rounded-xl border border-borda bg-noite-2 p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {atualizacao.status ? (
                      <SeloStatus
                        status={atualizacao.status}
                        tamanho="md"
                      />
                    ) : (
                      <span className="text-sm text-mudo">Atualização</span>
                    )}

                    <time className="text-xs text-mudo">
                      {formatarData(atualizacao.criadoEm)}
                    </time>
                  </div>

                  <p className="mt-4 leading-relaxed">
                    {atualizacao.mensagem}
                  </p>

                  <p className="mt-2 text-xs text-mudo">{atualizacao.autor}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  )
}