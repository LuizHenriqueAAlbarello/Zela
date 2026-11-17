import BotaoLink from '../components/Botao'

export default function NaoEncontrada() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-[1320px] flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <h1 className="titulo text-[clamp(2.8rem,8vw,5rem)]">Via sem saída</h1>
      <p className="mt-5 max-w-[42ch] text-mudo">
        Esse endereço não leva a lugar nenhum no Zela. Confira o link ou volte para o começo.
      </p>
      <BotaoLink para="/" className="mt-8">Voltar ao início</BotaoLink>
    </section>
  )
}