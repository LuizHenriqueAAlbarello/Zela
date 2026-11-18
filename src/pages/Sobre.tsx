import { useRef } from 'react'
import LuzesDaCidade from '../components/LuzesDaCidade'
import BotaoLink from '../components/Botao'

/** Um número de destaque com a explicação e a fonte de onde ele veio. */
interface Numero {
  valor: string
  descricao: string
  fonte: string
}

const NUMEROS: Numero[] = [
  {
    valor: '157 mil',
    descricao: 'solicitações por mês chegam, em média, ao SP156, o canal de atendimento da cidade.',
    fonte: 'Prefeitura de São Paulo, 2022',
  },
  {
    valor: '14%',
    descricao: 'dos pedidos do 1º semestre de 2019 foram de reparo de asfalto, o assunto mais pedido.',
    fonte: 'Câmara Municipal de São Paulo, 2019',
  },
]

/** Uma pergunta que a IA do Zela responde sobre cada chamado. */
interface PerguntaIa {
  pergunta: string
  resposta: string
}

const PERGUNTAS_IA: PerguntaIa[] = [
  {
    pergunta: 'Quanto tempo vai levar?',
    resposta:
      'A IA estima o prazo previsto de cada chamado a partir da categoria e do histórico de pedidos parecidos. Quem abriu sabe quando esperar uma resposta.',
  },
  {
    pergunta: 'O que é mais urgente?',
    resposta:
      'Cada chamado recebe uma prioridade de 1 a 5. Ela começa no peso da categoria (uma árvore com risco pesa mais que um poste apagado) e sobe conforme os vizinhos apoiam.',
  },
  {
    pergunta: 'Onde a cidade demora mais?',
    resposta:
      'Juntando os prazos por região, a IA aponta as zonas críticas: os bairros que esperam mais. Assim a subprefeitura enxerga onde precisa agir primeiro.',
  },
]

/** Uma pessoa que representa quem usa o Zela. */
interface Persona {
  nome: string
  perfil: string
  historia: string
}

const PERSONAS: Persona[] = [
  {
    nome: 'Dona Maria',
    perfil: '68 anos, Grajaú',
    historia:
      'Não tem paciência para formulário comprido. Abre o chamado do poste apagado da rua dela em poucos toques e acompanha o andamento sem precisar ligar para ninguém.',
  },
  {
    nome: 'Lucas',
    perfil: '24 anos, motoboy',
    historia:
      'Passa pelo mesmo buraco todo dia. Em vez de abrir outro pedido igual, apoia o chamado que já existe, e cada apoio ajuda a subir a prioridade.',
  },
  {
    nome: 'Carla',
    perfil: 'Gestora da subprefeitura',
    historia:
      'Precisa decidir o que atender primeiro. Vê a fila ordenada por prioridade e as zonas onde a espera é maior, e atualiza o status até o problema ser resolvido.',
  },
]

/** Um Objetivo de Desenvolvimento Sustentável da ONU ligado ao Zela. */
interface Ods {
  numero: number
  nome: string
  porque: string
}

const ODS: Ods[] = [
  {
    numero: 11,
    nome: 'Cidades e comunidades sustentáveis',
    porque:
      'Meta 11.7: espaços públicos seguros e acessíveis. Rua sem buraco, calçada inteira e poste aceso são exatamente isso.',
  },
  {
    numero: 10,
    nome: 'Redução das desigualdades',
    porque:
      'Mostrar quais bairros esperam mais deixa a diferença de atendimento à vista, e o que está à vista pode ser cobrado.',
  },
  {
    numero: 9,
    nome: 'Indústria, inovação e infraestrutura',
    porque: 'A IA ajuda a cidade a cuidar melhor da infraestrutura que já tem, atacando primeiro o que é mais urgente.',
  },
]

/** Uma tecnologia usada no projeto e o papel dela. */
interface Tecnologia {
  nome: string
  papel: string
}

const TECNOLOGIAS: Tecnologia[] = [
  { nome: 'React', papel: 'monta a interface em componentes reutilizáveis' },
  { nome: 'Vite', papel: 'roda o projeto em desenvolvimento e gera a versão final' },
  { nome: 'TypeScript', papel: 'tipa props, estados e dados da API' },
  { nome: 'Tailwind CSS', papel: 'estiliza tudo com classes utilitárias e responsivas' },
  { nome: 'React Router', papel: 'cuida das rotas da SPA, inclusive as com parâmetro' },
  { nome: 'API Java (Spring Boot)', papel: 'guarda os chamados e aplica as regras de negócio' },
  { nome: 'Vercel', papel: 'publica o front-end na internet' },
]

/** Página Sobre: por que o Zela existe, para quem ele é e com o que foi feito. */
export default function Sobre() {
  const palco = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* Título da aba do navegador (o React 19 leva esta tag para o <head> sozinho) */}
      <title>Sobre · Zela</title>

      {/* Cabeçalho: as luzes da cidade escrevem "SOBRE" no espaço do palco */}
      <section className="relative isolate overflow-hidden">
        <LuzesDaCidade palavra="SOBRE" palcoRef={palco} className="-z-10 opacity-70" />
        <div className="mx-auto max-w-[1320px] px-5 pt-14 pb-10 sm:px-8 md:pt-20">
          <div ref={palco} aria-hidden="true" className="h-[22vw] max-h-[190px] min-h-[80px]" />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_minmax(0,440px)] lg:items-end lg:gap-16">
            <h1 className="titulo animate-chegar text-[clamp(2.6rem,6vw,4.75rem)]">
              Por que o <span className="text-sodio">Zela existe</span>
            </h1>
            <p className="animate-chegar text-mudo [animation-delay:120ms]">
              Uma plataforma de zeladoria colaborativa para São Paulo. O cidadão registra o problema da rua, os
              vizinhos apoiam e a cidade responde com prazo e prioridade à vista de todos.
            </p>
          </div>
        </div>
      </section>

      {/* O problema: por que a zeladoria de hoje não dá conta */}
      <section aria-labelledby="titulo-problema" className="border-t border-borda bg-noite-2">
        <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <h2 id="titulo-problema" className="titulo text-[clamp(2.3rem,5vw,3.75rem)]">
              O pedido some no meio do caminho
            </h2>
            <div className="max-w-[60ch] space-y-5 text-mudo">
              <p>
                Quem vê um buraco, um poste apagado ou entulho na calçada nem sempre sabe onde reclamar. O pedido
                vai para um canal, depois para outro, e se perde no caminho.
              </p>
              <p>
                Quando chega, entra numa fila sem prioridade clara, e o cidadão quase nunca recebe retorno sobre o
                que aconteceu com ele. Sem resposta, as pessoas param de avisar, e o problema fica na rua.
              </p>
              <p className="text-papel">
                O Zela junta os pedidos num lugar só, mostra o que é mais urgente e deixa o andamento à vista do
                bairro inteiro.
              </p>
            </div>
          </div>

          {/* Os números que mostram o tamanho do problema, com a fonte de cada um */}
          <ul className="mt-16 grid gap-10 border-t border-borda pt-10 sm:grid-cols-2 sm:gap-8 md:mt-20">
            {NUMEROS.map((item) => (
              <li key={item.valor}>
                <p className="titulo numeros text-[clamp(3rem,8vw,5.5rem)] text-sodio">{item.valor}</p>
                <p className="mt-4 max-w-[40ch] text-papel">{item.descricao}</p>
                <p className="mt-2 text-sm text-mudo">Fonte: {item.fonte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* As 3 perguntas da IA: lista vertical, pergunta grande à esquerda e resposta à direita */}
      <section aria-labelledby="titulo-ia" className="border-t border-borda">
        <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
          <h2 id="titulo-ia" className="titulo max-w-[18ch] text-[clamp(2.3rem,5vw,3.75rem)]">
            Três perguntas que a IA responde
          </h2>
          <p className="mt-6 max-w-[50ch] text-mudo">Para cada chamado aberto, a IA do Zela ajuda a responder:</p>

          <dl className="mt-12 md:mt-16">
            {PERGUNTAS_IA.map((item) => (
              <div
                key={item.pergunta}
                className="grid gap-4 border-t border-borda py-8 md:grid-cols-2 md:gap-16 md:py-10"
              >
                <dt className="titulo text-[22px] sm:text-[26px]">{item.pergunta}</dt>
                <dd className="max-w-[55ch] text-mudo">{item.resposta}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Para quem: as 3 personas, cada uma com o jeito como usa o Zela */}
      <section aria-labelledby="titulo-personas" className="border-t border-borda bg-noite-2">
        <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
          <h2 id="titulo-personas" className="titulo text-[clamp(2.3rem,5vw,3.75rem)]">
            Para quem é o Zela
          </h2>
          <p className="mt-6 max-w-[50ch] text-mudo">
            Moradores de bairros periféricos, pedestres, pessoas com deficiência e idosos, e quem cuida da cidade
            do outro lado do balcão.
          </p>

          <ul className="mt-12 md:mt-16">
            {PERSONAS.map((persona) => (
              <li
                key={persona.nome}
                className="grid gap-3 border-t border-borda py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:py-10"
              >
                <div>
                  <h3 className="titulo text-[22px] sm:text-[26px]">{persona.nome}</h3>
                  <p className="mt-2 text-sm text-sodio">{persona.perfil}</p>
                </div>
                <p className="max-w-[60ch] text-mudo">{persona.historia}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ODS: os objetivos da ONU com que o Zela contribui */}
      <section aria-labelledby="titulo-ods" className="border-t border-borda">
        <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
          <h2 id="titulo-ods" className="titulo text-[clamp(2.3rem,5vw,3.75rem)]">
            Objetivos que o Zela ajuda a cumprir
          </h2>
          <p className="mt-6 max-w-[50ch] text-mudo">
            Os Objetivos de Desenvolvimento Sustentável (ODS) da ONU com que o projeto se conecta.
          </p>

          <ul className="mt-12 md:mt-16">
            {ODS.map((ods) => (
              <li
                key={ods.numero}
                className="grid gap-3 border-t border-borda py-8 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-8 md:py-10"
              >
                <p className="titulo numeros text-[clamp(3rem,6vw,4.5rem)] text-sodio" aria-hidden="true">
                  {ods.numero}
                </p>
                <div>
                  <h3 className="titulo text-[22px] sm:text-[26px]">
                    <span className="sr-only">ODS {ods.numero}: </span>
                    {ods.nome}
                  </h3>
                  <p className="mt-3 max-w-[60ch] text-mudo">{ods.porque}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tecnologias: com o que o Zela foi construído */}
      <section aria-labelledby="titulo-tecnologias" className="border-t border-borda bg-noite-2">
        <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
          <h2 id="titulo-tecnologias" className="titulo text-[clamp(2.3rem,5vw,3.75rem)]">
            Com o que foi feito
          </h2>
          <p className="mt-6 max-w-[50ch] text-mudo">
            Front-end em React com TypeScript, conversando com a API Java do grupo só por fetch.
          </p>

          <ul className="mt-12 grid gap-x-16 sm:grid-cols-2 md:mt-16">
            {TECNOLOGIAS.map((tecnologia) => (
              <li key={tecnologia.nome} className="border-t border-borda py-6">
                <p className="rotulo text-[14px] text-papel">{tecnologia.nome}</p>
                <p className="mt-2 text-mudo">{tecnologia.papel}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Chamada final: depois de entender o Zela, o próximo passo */}
      <section aria-labelledby="titulo-chamada" className="border-t border-borda">
        <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
          <h2 id="titulo-chamada" className="titulo max-w-[16ch] text-[clamp(2.3rem,5vw,3.75rem)]">
            Viu um problema na sua rua?
          </h2>
          <p className="mt-6 max-w-[50ch] text-mudo">
            Abra um chamado em poucos passos ou, se ele já existir, apoie o do vizinho. Dúvidas sobre o projeto
            vão pelo contato.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <BotaoLink para="/chamados/novo">Abrir chamado</BotaoLink>
            <BotaoLink para="/contato" variante="contorno">
              Falar com a equipe
            </BotaoLink>
          </div>
        </div>
      </section>
    </>
  )
}
