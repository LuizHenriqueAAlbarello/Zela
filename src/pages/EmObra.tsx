import BotaoLink from '../components/Botao'

interface EmObraProps {
  titulo: string
}

/** Página provisória enquanto a tela ainda não foi construída. */
export default function EmObra({ titulo }: EmObraProps) {
  return (
    <section className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8">
      <h1 className="titulo text-[clamp(2.6rem,7vw,4.5rem)]">{titulo}</h1>
      <p className="mt-5 max-w-[46ch] text-mudo">
        Trecho em obra. Esta página entra nas próximas etapas do projeto.
      </p>
      <BotaoLink para="/" className="mt-8">Voltar ao início</BotaoLink>
    </section>
  )
}