import { Link } from 'react-router-dom'
import Marca from './Marca'

interface LinkRodape {
  para: string
  rotulo: string
}

const NAVEGUE: LinkRodape[] = [
  { para: '/chamados', rotulo: 'Chamados' },
  { para: '/chamados/novo', rotulo: 'Abrir chamado' },
  { para: '/sobre', rotulo: 'Sobre o Zela' },
  { para: '/faq', rotulo: 'Perguntas frequentes' },
]

const EQUIPE: LinkRodape[] = [
  { para: '/integrantes', rotulo: 'Integrantes' },
  { para: '/contato', rotulo: 'Contato' },
]

export default function Rodape() {
  const link = 'text-mudo no-underline transition-colors hover:text-papel'
  return (
    <footer className="border-t border-borda bg-noite">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 pt-16 pb-12 sm:px-8 md:grid-cols-[1fr_auto_auto] md:gap-20">
        <div className="max-w-sm">
          <Marca />
          <p className="mt-5 text-[15px] text-mudo">
            Zeladoria colaborativa para São Paulo. Projeto da Global Solution 2026/2 da FIAP, turma 1TDSPF.
          </p>
        </div>

        <nav aria-label="Navegue">
          <h2 className="rotulo text-[13px] text-papel">Navegue</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {NAVEGUE.map((l) => (
              <li key={l.para}>
                <Link className={link} to={l.para}>{l.rotulo}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Equipe">
          <h2 className="rotulo text-[13px] text-papel">Equipe</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {EQUIPE.map((l) => (
              <li key={l.para}>
                <Link className={link} to={l.para}>{l.rotulo}</Link>
              </li>
            ))}
            <li className="text-mudo">
              Emergência: Defesa Civil <a className="numeros font-semibold text-papel" href="tel:199">199</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-borda">
        <p className="mx-auto max-w-[1320px] px-5 py-5 text-[13px] text-mudo sm:px-8">
          Dados de demonstração. Não substitui o SP156.
        </p>
      </div>
    </footer>
  )
}