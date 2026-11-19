import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Rodape from './components/Rodape'
import Home from './pages/Home'
import Integrantes from './pages/Integrantes'
import PerfilIntegrante from './pages/PerfilIntegrante'
import Sobre from './pages/Sobre'
import Faq from './pages/Faq'
import Contato from './pages/Contato'
import ListaChamados from './pages/ListaChamados'
import NaoEncontrada from './pages/NaoEncontrada'
import NovoChamado from './pages/NovoChamado'
import DetalheChamado from './pages/DetalheChamado'

/** Ao trocar de página, volta para o topo (o navegador não faz isso sozinho numa SPA). */
function RolarParaTopo() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only z-50 bg-sodio px-4 py-3 font-bold text-noite focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Pular para o conteúdo
      </a>
      <RolarParaTopo />
      <Header />

      <main id="conteudo" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chamados" element={<ListaChamados />} />
          <Route path="/chamados/novo" element={<NovoChamado />} />
          <Route path="/chamados/:id" element={<DetalheChamado />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/integrantes" element={<Integrantes />} />
          <Route path="/integrantes/:rm" element={<PerfilIntegrante />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>

      <Rodape />
    </div>
  )
}