
import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CATEGORIAS } from '../services/categorias'
import { criarChamado } from '../services/chamados'
import { ErroApi, mensagemDoErro } from '../services/api'
import type { CategoriaId, Chamado } from '../types/chamado'

interface ErrosFormulario {
  categoria?: string
  endereco?: string
  bairro?: string
  descricao?: string
}

export default function NovoChamado() {
  const [parametros] = useSearchParams()

  const categoriaInicial = CATEGORIAS.some(
    (categoria) => categoria.id === parametros.get('categoria'),
  )
    ? (parametros.get('categoria') as CategoriaId)
    : 'BURACO'

  const [categoria, setCategoria] = useState<CategoriaId>(categoriaInicial)
  const [endereco, setEndereco] = useState(parametros.get('endereco') ?? '')
  const [bairro, setBairro] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erros, setErros] = useState<ErrosFormulario>({})
  const [carregando, setCarregando] = useState(false)
  const [erroApi, setErroApi] = useState('')
  const [chamadoCriado, setChamadoCriado] = useState<Chamado | null>(null)

  const categoriaSelecionada = CATEGORIAS.find(
    (item) => item.id === categoria,
  )

  async function enviarFormulario(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErroApi('')

    const novosErros: ErrosFormulario = {}

    if (!categoria) novosErros.categoria = 'Selecione uma categoria.'

    if (endereco.trim().length < 5) {
      novosErros.endereco = 'Informe um endereço com pelo menos 5 caracteres.'
    }

    if (!bairro.trim()) novosErros.bairro = 'Informe o bairro.'

    if (descricao.trim().length < 20) {
      novosErros.descricao = 'A descrição precisa ter pelo menos 20 caracteres.'
    }

    setErros(novosErros)

    if (Object.keys(novosErros).length > 0) return

    setCarregando(true)

    try {
      const novoChamado = await criarChamado({
        categoria,
        endereco: endereco.trim(),
        bairro: bairro.trim(),
        descricao: descricao.trim(),
      })

      setChamadoCriado(novoChamado)
    } catch (erro) {
      if (erro instanceof ErroApi && erro.status === 409) {
        setErroApi(
          'Já existe um chamado aberto para esse problema nesse endereço. Confira os chamados existentes antes de criar outro.',
        )
      } else if (erro instanceof ErroApi && erro.status === 400 && erro.detalhes.length > 0) {
        setErroApi(erro.detalhes.join(' '))
      } else {
        setErroApi(mensagemDoErro(erro))
      }
    } finally {
      setCarregando(false)
    }
  }

  const campo =
    'w-full rounded-xl border border-borda bg-noite px-4 py-3 text-papel outline-none transition focus:border-sodio focus:ring-2 focus:ring-sodio/30'

  if (chamadoCriado) {
    return (
      <div className="min-h-screen bg-noite px-5 py-16 text-papel">
        <section className="mx-auto max-w-[700px] rounded-3xl border border-borda bg-noite-2 p-8">
          <p className="rotulo text-sodio">SOLICITAÇÃO REGISTRADA</p>

          <h1 className="titulo mt-4 text-3xl text-verde">
            Chamado criado com sucesso!
          </h1>

          <p className="mt-4 text-mudo">
            Sua solicitação foi registrada. Agora você pode acompanhar o andamento.
          </p>

          <div className="mt-8 rounded-2xl border border-borda p-6">
            <p className="text-sm text-mudo">Número do protocolo</p>
            <p className="numeros mt-2 text-3xl">#{chamadoCriado.id}</p>

            <p className="mt-5 text-sm text-mudo">Prioridade</p>
            <p className="mt-1 font-semibold">{chamadoCriado.prioridade}</p>

            {chamadoCriado.prazoPrevistoDias != null && (
              <>
                <p className="mt-5 text-sm text-mudo">Prazo previsto</p>
                <p className="mt-1 font-semibold">
                  {chamadoCriado.prazoPrevistoDias} dias
                </p>
              </>
            )}
          </div>

          <Link
            to={`/chamados/${chamadoCriado.id}`}
            className="rotulo mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-sodio px-8 text-noite transition hover:bg-[#ffb066]"
          >
            Acompanhar chamado
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-noite text-papel">
      <section className="border-b border-borda bg-noite-2">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8">
          <h1 className="titulo text-[clamp(2.6rem,6vw,4.75rem)]">
            Novo chamado
          </h1>

          <p className="mt-5 max-w-[600px] text-mudo">
            Viu um problema na sua rua? Registre aqui para que a comunidade
            possa acompanhar e apoiar.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 py-12 sm:px-8">
        <form onSubmit={enviarFormulario} noValidate className="space-y-8">
          <fieldset>
            <legend className="titulo text-2xl">Qual é o problema?</legend>

            <p className="mb-5 mt-2 text-sm text-mudo">
              Escolha a categoria que melhor representa a situação.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CATEGORIAS.map((item) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition ${
                    categoria === item.id
                      ? 'border-sodio bg-sodio/10'
                      : 'border-borda bg-noite-2 hover:border-papel'
                  }`}
                >
                  <input
                    type="radio"
                    name="categoria"
                    value={item.id}
                    checked={categoria === item.id}
                    onChange={() => setCategoria(item.id)}
                    className="accent-sodio"
                  />

                  <span className="font-semibold">{item.nome}</span>

                  <span className="text-xs text-mudo">
                    Prazo: {item.prazoDias} dias
                  </span>
                </label>
              ))}
            </div>

            {categoriaSelecionada && (
              <p className="mt-4 text-sm text-sodio">
                Prazo de referência: até {categoriaSelecionada.prazoDias} dias
                {' · '}Prioridade inicial {categoriaSelecionada.peso}
              </p>
            )}

            {erros.categoria && (
              <p role="alert" className="mt-2 text-sm text-erro">
                {erros.categoria}
              </p>
            )}
          </fieldset>

          <div>
            <label htmlFor="endereco" className="mb-2 block font-semibold">
              Endereço
            </label>

            <input
              id="endereco"
              value={endereco}
              onChange={(evento) => setEndereco(evento.target.value)}
              placeholder="Ex.: Rua das Flores, 120"
              className={campo}
              aria-invalid={Boolean(erros.endereco)}
            />

            {erros.endereco && (
              <p role="alert" className="mt-2 text-sm text-erro">
                {erros.endereco}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="bairro" className="mb-2 block font-semibold">
              Bairro
            </label>

            <input
              id="bairro"
              value={bairro}
              onChange={(evento) => setBairro(evento.target.value)}
              placeholder="Ex.: Pirituba"
              className={campo}
              aria-invalid={Boolean(erros.bairro)}
            />

            {erros.bairro && (
              <p role="alert" className="mt-2 text-sm text-erro">
                {erros.bairro}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="descricao" className="mb-2 block font-semibold">
              Descrição do problema
            </label>

            <textarea
              id="descricao"
              value={descricao}
              onChange={(evento) => setDescricao(evento.target.value)}
              placeholder="Conte o que está acontecendo..."
              rows={5}
              maxLength={1000}
              className={campo}
              aria-invalid={Boolean(erros.descricao)}
            />

            <p className="mt-2 text-right text-xs text-mudo numeros">
              {descricao.length}/1000
            </p>

            {erros.descricao && (
              <p role="alert" className="mt-2 text-sm text-erro">
                {erros.descricao}
              </p>
            )}
          </div>

          {erroApi && (
            <div
              role="alert"
              className="rounded-xl border border-erro bg-erro/10 p-4 text-sm text-papel"
            >
              {erroApi}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="rotulo min-h-12 rounded-full bg-sodio px-8 text-noite transition hover:bg-[#ffb066] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? 'Enviando chamado...' : 'Continuar'}
          </button>
        </form>
      </section>
    </div>
  )
}
