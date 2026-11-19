# Zela — Zeladoria Colaborativa

Plataforma de zeladoria colaborativa desenvolvida para São Paulo como parte da Global Solution 2026/2 da FIAP, turma 1TDSPF.

## Sobre o projeto

O Zela é uma plataforma que conecta cidadãos e comunidade na identificação e no acompanhamento de problemas nos espaços públicos.

Por meio da aplicação, os moradores podem registrar ocorrências, apoiar chamados existentes e acompanhar o andamento das solicitações.

A solução também utiliza inteligência artificial para auxiliar na previsão de prazos e na definição de prioridades, promovendo transparência, participação cidadã e melhoria dos serviços urbanos.

## Funcionalidades

- Cadastro de novos chamados de zeladoria.
- Consulta e acompanhamento de chamados.
- Visualização dos detalhes de cada ocorrência.
- Histórico de atualizações dos chamados.
- Apoio da comunidade às solicitações existentes.
- Classificação por categorias e prioridades.
- Identificação dos integrantes da equipe.
- Páginas institucionais: Início, Sobre, FAQ e Contato.

## Tecnologias utilizadas

### Front-end
- React
- TypeScript
- Vite
- Tailwind CSS

### Back-end e integração
- API REST
- Fetch API
- Java
- Spring Boot

## Estrutura do projeto

```text
Zela/
├── public/
│   └── integrantes/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── package.json
└── README.md
```

## Como executar o projeto

### Pré-requisitos

- Node.js
- npm
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/LuizHenriqueAAlbarello/Zela.git
```

### 2. Entrar na pasta

```bash
cd Zela
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar a API

Crie um arquivo `.env` na raiz do projeto e adicione:

```env
VITE_API_URL=https://zela-api-bkwx.onrender.com
```

### 5. Executar a aplicação

```bash
npm run dev
```

### 6. Gerar a versão de produção

```bash
npm run build
```

## API

A aplicação utiliza uma API REST hospedada no Render.

- **URL base:** https://zela-api-bkwx.onrender.com
- **Health:** https://zela-api-bkwx.onrender.com/health
- **Categorias:** https://zela-api-bkwx.onrender.com/categorias
- **Chamados:** https://zela-api-bkwx.onrender.com/chamados

## Integrantes

| Integrante | RM |
|---|---:|
| Luiz Henrique Alves Albarello | 572727 |
| Matheus Rodrigues Serrão | 570469 |
| Vinicius Silveira Espósito | 571844 |
| Lucas Luque Cabral | 573347 |

## Links do projeto

- **Repositório GitHub:** https://github.com/LuizHenriqueAAlbarello/Zela
- **Deploy:** Aguardando publicação.
- **Vídeo de apresentação:** Aguardando publicação.
- **API:** https