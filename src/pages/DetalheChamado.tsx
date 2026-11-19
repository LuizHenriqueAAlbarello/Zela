
import { useParams, Link } from 'react-router-dom'
import CaminhoLuz from '../components/CaminhoLuz'
import SeloStatus from '../components/SeloStatus'
import type { StatusChamado } from '../types/chamado'

const statusAtual: StatusChamado = 'EM_ANALISE'

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
    texto: 'O serviço será realizado pela equipe responsável.',
  },
  {
    status: 'RESOLVIDO' as const,
    quem: 'Resolvido',
    texto: 'O problema foi solucionado.',
  },
]

export default function DetalheChamado() {
  const { id } = useParams()

  const indiceAtual = paradas.findIndex(
    (parada) => parada.status === statusAtual,
  )

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

          <p className="rotulo mt-8 text-sodio">
            ACOMPANHAMENTO
          </p>

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
                #{id}
              </h2>
            </div>

            <SeloStatus status={statusAtual} tamanho="md" />
          </div>

          <div className="mt-8 grid gap-6 border-t border-borda pt-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-mudo">Categoria</p>
              <p className="mt-2 font-semibold">Buraco na via</p>
            </div>

            <div>
              <p className="text-sm text-mudo">Endereço</p>
              <p className="mt-2 font-semibold">
                Aguardando dados do chamado
              </p>
            </div>

            <div>
              <p className="text-sm text-mudo">Bairro</p>
              <p className="mt-2 font-semibold">
                Aguardando dados do chamado
              </p>
            </div>

            <div>
              <p className="text-sm text-mudo">Data de abertura</p>
              <p className="mt-2 font-semibold">
                Aguardando dados do chamado
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="rotulo text-sodio">ANDAMENTO</p>
          <h2 className="titulo mt-3 text-3xl">
            O CAMINHO DA SOLUÇÃO
          </h2>

          <div className="mt-10">
            <CaminhoLuz
              paradas={paradas}
              atual={indiceAtual}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-borda bg-noite-2 p-6">
          <p className="rotulo text-sodio">ANÁLISE INTELIGENTE</p>
          <h2 className="titulo mt-3 text-2xl">
            ANÁLISE DO PROBLEMA
          </h2>

          <p className="mt-4 leading-relaxed text-mudo">
            As informações da análise serão exibidas aqui após a
            integração com a API.
          </p>
        </div>

        <div>
          <p className="rotulo text-sodio">HISTÓRICO</p>
          <h2 className="titulo mt-3 text-3xl">
            ATUALIZAÇÕES DO CHAMADO
          </h2>

          <div className="mt-6 rounded-xl border border-borda p-6">
            <p className="text-mudo">
              O histórico de atualizações será carregado pela API.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
