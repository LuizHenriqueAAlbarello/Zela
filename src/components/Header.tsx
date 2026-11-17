import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Marca from './Marca'

interface ItemMenu {
  para: string
  rotulo: string
}

export const ITENS_MENU: ItemMenu[] = [
  { para: '/', rotulo: 'Início' },
  { para: '/chamados', rotulo: 'Chamados' },
  { para: '/sobre', rotulo: 'Sobre' },
  { para: '/faq', rotulo: 'FAQ' },
  { para: '/integrantes', rotulo: 'Integrantes' },
  { para: '/contato', rotulo: 'Contato' },
]

export default function Header() {
  const [aberto, setAberto] = useState<boolean>(false)
  const { pathname } = useLocation()

  // Fecha o menu ao trocar de página
  useEffect(() => {
    setAberto(false)
  }, [pathname])

  // Esc fecha; trava a rolagem do fundo enquanto o menu está aberto
  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false)
    }
    document.addEventListener('keydown', aoTeclar)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
    }
  }, [aberto])

  return (
    <header className="relative z-30 border-b border-borda bg-noite">
      <nav aria-label="Principal" className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" aria-label="Zela, página inicial" className="-m-1 rounded p-1">
          <Marca />
        </Link>

        {/* Menu do desktop (a partir de 1024px) */}
        <div className="hidden items-center gap-7 lg:flex">
          <ul className="flex items-center gap-7 text-[15px] font-medium">
            {ITENS_MENU.map((item) => (
              <li key={item.para}>
                <NavLink
                  to={item.para}
                  end={item.para === '/'}
                  className={({ isActive }) =>
                    `block border-b-[3px] py-2.5 no-underline transition-colors duration-200 ${
                      isActive ? 'border-sodio text-papel' : 'border-transparent text-mudo hover:text-papel'
                    }`
                  }
                >
                  {item.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/chamados/novo"
            className="rotulo rounded-full bg-sodio px-5 py-3 text-[13px] text-noite no-underline transition-colors duration-200 hover:bg-[#ffb066]"
          >
            Abrir chamado
          </Link>
        </div>

        {/* Botão do menu mobile (até 1023px) */}
        <button
          type="button"
          className="grid size-12 place-items-center rounded-full text-papel hover:bg-noite-3 lg:hidden"
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? <X className="size-7" strokeWidth={2.2} /> : <Menu className="size-7" strokeWidth={2.2} />}
        </button>
      </nav>

      {/* Menu mobile: painel que cobre a página abaixo do header */}
      <div
        id="menu-mobile"
        hidden={!aberto}
        className="absolute inset-x-0 top-full h-[calc(100dvh-100%)] overflow-y-auto bg-noite px-5 pt-4 pb-10 lg:hidden"
      >
        <ul className="flex flex-col">
          {ITENS_MENU.map((item, i) => (
            <li key={item.para} className="animate-chegar border-b border-borda" style={{ animationDelay: `${i * 35}ms` }}>
              <NavLink
                to={item.para}
                end={item.para === '/'}
                className={({ isActive }) =>
                  `titulo flex items-center gap-3 py-4 text-[30px] no-underline ${isActive ? 'text-sodio' : 'text-papel'}`
                }
              >
                {item.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
        <Link
          to="/chamados/novo"
          className="rotulo mt-8 flex min-h-14 items-center justify-center rounded-full bg-sodio text-noite no-underline"
        >
          Abrir chamado
        </Link>
      </div>
    </header>
  )
}