import { useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { ArrowUpRight, CircleCheck, LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import LuzesDaCidade from '../components/LuzesDaCidade'
import type { AssuntoContato, DadosContato, ErrosContato, EstadoEnvio } from '../types/contato'
import {
  ASSUNTOS_CONTATO,
  EMAIL_EQUIPE,
  MINIMO_MENSAGEM,
  URL_REPOSITORIO,
  enviarContato,
  validarContato,
} from '../services/contato'
import { primeiroNome } from '../services/integrantes'

/** Formulário vazio: estado inicial e o que volta depois de limpar. */
const VAZIO: DadosContato = { nome: '', email: '', assunto: '', mensagem: '' }

/** Classes do campo de formulário (padrão do design system no CLAUDE.md). */
const CAMPO_BASE =
  'w-full rounded-xl border border-borda bg-noite px-3.5 text-base text-papel transition-colors ' +
  'hover:border-[#3a4050] focus-visible:border-sodio focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sodio/40'
const CAMPO = `${CAMPO_BASE} h-12`

const ROTULO = 'mb-1.5 block text-[13px] font-semibold text-mudo'
const ERRO = 'mt-1.5 text-sm font-semibold text-erro'
const LINK = 'font-semibold text-papel underline decoration-borda underline-offset-4 transition-colors hover:text-sodio'

/** Ordem dos campos na tela: o foco vai para o primeiro desta lista que tiver erro. */
const ORDEM_CAMPOS: (keyof DadosContato)[] = ['nome', 'email', 'assunto', 'mensagem']

/** Página Contato: formulário para falar com a equipe do Zela. */
export default function Contato() {
  const palco = useRef<HTMLDivElement>(null)
  // Formulário controlado: o React guarda o valor de cada campo
  const [dados, setDados] = useState<DadosContato>(VAZIO)
  // Mensagem de erro de cada campo; só aparece depois de tentar enviar
  const [erros, setErros] = useState<ErrosContato>({})
  // Controla o botão: "Enviar mensagem" ou "Enviando…"
  const [estado, setEstado] = useState<EstadoEnvio>('preenchendo')
  // Referência a cada campo, para conseguir mover o foco até ele
  const refNome = useRef<HTMLInputElement>(null)
  const refEmail = useRef<HTMLInputElement>(null)
  const refAssunto = useRef<HTMLSelectElement>(null)
  const refMensagem = useRef<HTMLTextAreaElement>(null)
  // Card de sucesso: recebe o foco quando aparece, para o leitor de tela anunciar o resultado
  const refSucesso = useRef<HTMLDivElement>(null)

  /** Coloca o cursor no campo pedido. */
  function focarCampo(campo: keyof DadosContato) {
    const referencias = { nome: refNome, email: refEmail, assunto: refAssunto, mensagem: refMensagem }
    referencias[campo].current?.focus()
  }

  /** Atualiza um campo só, mantendo os outros como estão, e apaga o erro dele enquanto a pessoa corrige. */
  function atualizar<Campo extends keyof DadosContato>(campo: Campo, valor: DadosContato[Campo]) {
    setDados((atual) => ({ ...atual, [campo]: valor }))
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    // Impede o navegador de recarregar a página ao enviar o formulário
    evento.preventDefault()
    // Valida antes de enviar: cada campo com problema ganha a sua mensagem
    const novosErros = validarContato(dados)
    setErros(novosErros)

    // Leva o foco ao primeiro campo com erro (ajuda quem usa teclado ou leitor de tela)
    const primeiroComErro = ORDEM_CAMPOS.find((campo) => novosErros[campo])
    if (primeiroComErro) {
      focarCampo(primeiroComErro)
      return
    }

    // Tudo certo: mostra "Enviando…", espera o envio terminar e troca o formulário pelo card de sucesso
    setEstado('enviando')
    await enviarContato(dados)
    // flushSync desenha o card na hora, para o foco conseguir ir até ele logo em seguida
    flushSync(() => setEstado('enviado'))
    refSucesso.current?.focus()
  }

  /** Limpa tudo e volta ao formulário, com o cursor no primeiro campo. */
  function novaMensagem() {
    flushSync(() => {
      setDados(VAZIO)
      setErros({})
      setEstado('preenchendo')
    })
    refNome.current?.focus()
  }

  return (
    <>
      {/* Cabeçalho: as luzes da cidade escrevem "CONTATO" no espaço do palco */}
      <section className="relative isolate overflow-hidden">
        <LuzesDaCidade palavra="CONTATO" palcoRef={palco} className="-z-10 opacity-70" />
        <div className="mx-auto max-w-[1320px] px-5 pt-14 pb-10 sm:px-8 md:pt-20">
          <div ref={palco} aria-hidden="true" className="h-[22vw] max-h-[190px] min-h-[80px]" />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_minmax(0,440px)] lg:items-end lg:gap-16">
            <h1 className="titulo animate-chegar text-[clamp(2.6rem,6vw,4.75rem)]">
              Fale com a <span className="text-sodio">equipe</span>
            </h1>
            <p className="animate-chegar text-mudo [animation-delay:120ms]">
              Dúvida, sugestão ou problema no site? Escreva para a gente. Para registrar um problema da rua, use "Abrir
              chamado".
            </p>
          </div>
        </div>
      </section>

      {/* Formulário de contato */}
      <section aria-labelledby="titulo-formulario" className="border-t border-borda bg-noite-2">
        <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-[640px]">
            <h2 id="titulo-formulario" className="titulo text-[22px] sm:text-[26px]">
              Envie sua mensagem
            </h2>

            {estado === 'enviado' ? (
              // Mensagem de sucesso: aparece no lugar do formulário depois do envio
              <div
                ref={refSucesso}
                tabIndex={-1}
                role="status"
                className="mt-8 rounded-3xl border border-verde/40 bg-noite p-6 outline-none sm:p-8"
              >
                <CircleCheck aria-hidden="true" strokeWidth={2.4} className="size-8 text-verde" />
                <h3 className="titulo mt-5 text-[22px] sm:text-[26px]">Mensagem recebida</h3>
                <p className="mt-3 text-mudo">
                  Obrigado, {primeiroNome(dados.nome)}. Respondemos em até 2 dias úteis no e-mail{' '}
                  <span className="break-all text-papel">{dados.email.trim()}</span>.
                </p>
                <button
                  type="button"
                  onClick={novaMensagem}
                  className="rotulo mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-borda px-6 text-[14px] text-papel transition-colors hover:border-papel"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              /* noValidate: desliga os balões do navegador, porque a validação é feita pelo nosso código */
              <form noValidate onSubmit={enviar} aria-busy={estado === 'enviando'} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="nome" className={ROTULO}>
                    Nome
                  </label>
                  <input
                    ref={refNome}
                    id="nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    value={dados.nome}
                    onChange={(e) => atualizar('nome', e.target.value)}
                    aria-invalid={Boolean(erros.nome)}
                    aria-describedby={erros.nome ? 'nome-erro' : undefined}
                    className={`${CAMPO} ${erros.nome ? 'border-erro' : ''}`}
                  />
                  {erros.nome && (
                    <p id="nome-erro" role="alert" className={ERRO}>
                      {erros.nome}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className={ROTULO}>
                    E-mail
                  </label>
                  <input
                    ref={refEmail}
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={dados.email}
                    onChange={(e) => atualizar('email', e.target.value)}
                    aria-invalid={Boolean(erros.email)}
                    aria-describedby={erros.email ? 'email-erro' : undefined}
                    className={`${CAMPO} ${erros.email ? 'border-erro' : ''}`}
                  />
                  {erros.email && (
                    <p id="email-erro" role="alert" className={ERRO}>
                      {erros.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="assunto" className={ROTULO}>
                    Assunto
                  </label>
                  {/* [color-scheme:dark] deixa a lista de opções do navegador escura, combinando com o site */}
                  <select
                    ref={refAssunto}
                    id="assunto"
                    name="assunto"
                    value={dados.assunto}
                    onChange={(e) => atualizar('assunto', e.target.value as AssuntoContato | '')}
                    aria-invalid={Boolean(erros.assunto)}
                    aria-describedby={erros.assunto ? 'assunto-erro' : undefined}
                    className={`${CAMPO} [color-scheme:dark] ${erros.assunto ? 'border-erro' : ''}`}
                  >
                    <option value="">Escolha um assunto</option>
                    {ASSUNTOS_CONTATO.map((assunto) => (
                      <option key={assunto.valor} value={assunto.valor}>
                        {assunto.rotulo}
                      </option>
                    ))}
                  </select>
                  {erros.assunto && (
                    <p id="assunto-erro" role="alert" className={ERRO}>
                      {erros.assunto}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="mensagem" className={ROTULO}>
                    Mensagem
                  </label>
                  <textarea
                    ref={refMensagem}
                    id="mensagem"
                    name="mensagem"
                    rows={6}
                    value={dados.mensagem}
                    onChange={(e) => atualizar('mensagem', e.target.value)}
                    aria-invalid={Boolean(erros.mensagem)}
                    aria-describedby={erros.mensagem ? 'mensagem-contador mensagem-erro' : 'mensagem-contador'}
                    className={`${CAMPO_BASE} min-h-40 resize-y py-3 ${erros.mensagem ? 'border-erro' : ''}`}
                  />
                  {/* Contador: mostra quantos caracteres já foram digitados e qual é o mínimo */}
                  <p id="mensagem-contador" className="mt-1.5 text-sm text-mudo">
                    <span className="numeros">{dados.mensagem.trim().length}</span> caracteres · mínimo{' '}
                    <span className="numeros">{MINIMO_MENSAGEM}</span>
                  </p>
                  {erros.mensagem && (
                    <p id="mensagem-erro" role="alert" className={ERRO}>
                      {erros.mensagem}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={estado === 'enviando'}
                  className="rotulo inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sodio px-6 text-[14px] text-noite shadow-[0_8px_30px_-8px_rgba(255,154,60,.55)] transition-colors hover:bg-[#ffb066] disabled:opacity-60"
                >
                  {estado === 'enviando' ? (
                    <>
                      <LoaderCircle aria-hidden="true" strokeWidth={2.4} className="size-4 animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    'Enviar mensagem'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Outros canais e o lembrete de emergência */}
          <aside aria-labelledby="titulo-canais" className="max-w-[640px]">
            <h2 id="titulo-canais" className="titulo text-[22px] sm:text-[26px]">
              Outros canais
            </h2>
            <ul className="mt-6 space-y-5">
              {EMAIL_EQUIPE && (
                <li>
                  <p className="text-[13px] font-semibold text-mudo">E-mail da equipe</p>
                  <a href={`mailto:${EMAIL_EQUIPE}`} className={`${LINK} break-all`}>
                    {EMAIL_EQUIPE}
                  </a>
                </li>
              )}
              <li>
                <p className="text-[13px] font-semibold text-mudo">Código do projeto</p>
                <a
                  href={URL_REPOSITORIO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${LINK} inline-flex items-center gap-1`}
                >
                  Repositório no GitHub
                  <ArrowUpRight aria-hidden="true" strokeWidth={2.4} className="size-4" />
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>
              <li>
                <p className="text-[13px] font-semibold text-mudo">Quem fez</p>
                <Link to="/integrantes" className={LINK}>
                  Conheça os integrantes
                </Link>
              </li>
            </ul>

            {/* Emergência: o Zela não atende urgências, então a página aponta para quem atende */}
            <div className="mt-10 rounded-3xl border border-borda bg-noite p-6">
              <p className="font-semibold text-papel">Emergência não é caso para o Zela.</p>
              <p className="mt-2 text-mudo">
                Árvore caindo, alagamento ou deslizamento: Defesa Civil{' '}
                <a href="tel:199" className={`${LINK} numeros`}>
                  199
                </a>
                . Incêndio ou pessoa em risco: Bombeiros{' '}
                <a href="tel:193" className={`${LINK} numeros`}>
                  193
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
