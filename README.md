# Zela — Zeladoria Colaborativa

Plataforma de zeladoria colaborativa para a cidade de São Paulo, desenvolvida na Global Solution 2026/2 (CitizenTech) da FIAP — Front-End Design Engineering.

## Objetivo

Pedidos de zeladoria (buraco na via, poste apagado, lixo, árvore com risco, calçada quebrada) se perdem entre canais, chegam duplicados e não dão retorno ao cidadão. O Zela centraliza esses pedidos: o morador **abre um chamado**, **apoia** um chamado que já existe em vez de duplicar ("eu também vi") e **acompanha o andamento** até a resolução. Cada apoio aumenta a prioridade do chamado, e o histórico mostra cada atualização feita pela prefeitura.

O front-end é uma SPA em React que consome a **API REST Java** da disciplina de Domain Driven Design Using Java, publicada no Render com banco Oracle.

## Links do projeto

| | |
|---|---|
| **Aplicação (Vercel)** | https://zela-ochre-three.vercel.app |
| **Repositório (GitHub)** | https://github.com/LuizHenriqueAAlbarello/Zela |
| **API Java (Render)** | https://zela-api-bkwx.onrender.com |
| **Vídeo (YouTube)** | https://youtu.be/S1Te0p6EMQQ |

> A API usa o plano gratuito do Render: depois de alguns minutos sem uso ela "dorme", e a primeira requisição pode levar cerca de 1 minuto. Abra https://zela-api-bkwx.onrender.com/health antes de testar.

## Funcionalidades

- **Abrir chamado** (`/chamados/novo`): formulário com validação de categoria, endereço, bairro e descrição; envia `POST /chamados` e mostra o protocolo criado.
- **Lista de chamados** (`/chamados`): dados de `GET /chamados`, com busca por bairro/endereço/protocolo, filtros por status e categoria e ordenação por prioridade, data ou apoios.
- **Detalhe do chamado** (`/chamados/:id`): dados do chamado, caminho de status e histórico (`GET /chamados/{id}/atualizacoes`).
- **Apoiar chamado** ("Eu também vi"): `POST /chamados/{id}/apoios`; a API recalcula a prioridade e bloqueia apoio repetido (409).
- **Integrantes** (`/integrantes` e `/integrantes/:rm`), **Sobre**, **FAQ** e **Contato** (formulário com validação).
- Estados de carregamento, erro de requisição (com "Tentar de novo") e ausência de dados.
- Layout responsivo para mobile (390 × 844), tablet (768 × 1024) e desktop (1440 × 900).

## Tecnologias

**Front-end:** React 19, Vite, TypeScript, Tailwind CSS 4, React Router e **Fetch API** (sem Axios).
**Back-end consumido:** Java 17 + Spring Boot 3 (API REST), JDBC com Oracle Database.
**Publicação:** Vercel (front-end), Render com Docker (API) e GitHub (versionamento).

## Endpoints da API usados pelo front

| Método | Rota | Uso no front |
|---|---|---|
| GET | `/chamados` | Lista de chamados e indicadores |
| GET | `/chamados/{id}` | Detalhe do chamado |
| GET | `/chamados/{id}/atualizacoes` | Histórico do chamado |
| POST | `/chamados` | Abrir chamado |
| POST | `/chamados/{id}/apoios` | Apoiar chamado |
| POST | `/cidadaos` | Cadastro do cidadão visitante (sem login) |

## Estrutura de pastas

```text
Zela/
├── public/
│   └── integrantes/        # fotos dos integrantes
├── src/
│   ├── components/         # componentes reutilizáveis (Header, Rodape, Botao, SeloStatus, CategoriaIcone...)
│   ├── hooks/              # hooks próprios (useRevelar, useCanvasAnimado)
│   ├── pages/              # uma página por rota
│   ├── services/           # chamadas à API com fetch (api.ts, chamados.ts, cidadaos.ts...)
│   ├── types/              # tipos e interfaces TypeScript
│   ├── App.tsx             # rotas da aplicação
│   ├── index.css
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── vercel.json             # redireciona as rotas da SPA para o index.html
└── vite.config.ts
```

## Rotas

| Rota | Página |
|---|---|
| `/` | Home |
| `/chamados` | Lista de chamados |
| `/chamados/novo` | Abrir chamado |
| `/chamados/:id` | Detalhe do chamado (rota com parâmetro) |
| `/integrantes` | Integrantes |
| `/integrantes/:rm` | Perfil do integrante (rota com parâmetro) |
| `/sobre` | Sobre |
| `/faq` | FAQ |
| `/contato` | Contato |

## Como executar

Pré-requisitos: Node.js 20.19 ou superior, npm e Git.

```bash
git clone https://github.com/LuizHenriqueAAlbarello/Zela.git
cd Zela
npm install
```

Crie um arquivo `.env` na raiz (há um modelo em `.env.example`):

```env
VITE_API_URL=https://zela-api-bkwx.onrender.com
```

```bash
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # versão de produção na pasta dist/
npm run preview  # testa a versão de produção localmente
```

Na Vercel, a mesma variável `VITE_API_URL` está configurada nas Environment Variables do projeto.

## Integrantes

| Nome | RM | Turma | GitHub |
|---|---|---|---|
| Luiz Henrique Alves Albarello | 572727 | 1TDSPF | [LuizHenriqueAAlbarello](https://github.com/LuizHenriqueAAlbarello) |
| Matheus Rodrigues Serrão | 570469 | 1TDSPF | [MatheusRodriguesSerrao](https://github.com/MatheusRodriguesSerrao) |
| Vinicius Silveira Espósito | 571844 | 1TDSPV | [ViniEsposito-dev](https://github.com/ViniEsposito-dev) |
| Lucas Luque Cabral | 573347 | 1TDSPV | [LucasCabral0603](https://github.com/LucasCabral0603) |

## Contato

- Página de contato da aplicação: https://zela-ochre-three.vercel.app/contato
- Representante do grupo: Luiz Henrique Alves Albarello — luizhenriquealvesalbarello@gmail.com
- Perfis no GitHub e LinkedIn de cada integrante: página https://zela-ochre-three.vercel.app/integrantes

Obrigado!