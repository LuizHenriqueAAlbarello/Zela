# Zela API — Zeladoria Colaborativa

Back-end da solução **Zela** na **Global Solution 2026/2 · CitizenTech** (FIAP), disciplina **Domain Driven Design Using Java**.

O cidadão registra problemas do espaço público (buraco, lâmpada queimada, lixo, árvore caída). A prefeitura recebe os chamados já priorizados e acompanha os pontos críticos de cada bairro. Outros cidadãos podem **apoiar** um chamado já aberto em vez de criar um duplicado, o que também sobe a prioridade dele.

## Integrantes

| RM | Nome completo | Turma |
| --- | --- | --- |
| 573347 | Lucas Luque Cabral | 1TDSPV |
| 572727 | Luiz Henrique Alves Albarello | 1TDSPF |
| 570469 | Matheus Rodrigues Serrão | 1TDSPF |
| 571844 | Vinicius Silveira Espósito | 1TDSPV |

## Links

- **API no Render:** https://zela-api-bkwx.onrender.com (teste: https://zela-api-bkwx.onrender.com/health)
- **Vídeo (YouTube, não listado):** `PREENCHER: https://youtu.be/...`
- **Front-end do grupo (consome esta API):** https://github.com/LuizHenriqueAAlbarello/Zela

> ⚠️ Antes de enviar ao Portal, troque o `PREENCHER` do vídeo acima, o do `integrantes.txt` e o da capa do PDF.

> No plano gratuito o Render "dorme" após alguns minutos sem uso. A primeira chamada pode levar cerca de 1 minuto: abra `/health` antes de testar.

## Tecnologias

Java 17 · Spring Boot 3.3 · JDBC puro (DAO + `PreparedStatement`) · Oracle FIAP · ModelMapper · Bean Validation · Docker (multi-stage) · Render.
**Não usa** JPA, Hibernate nem Spring Data. O `spring-boot-starter-jdbc` só fornece o `DataSource` (HikariCP) e as transações.

## Estrutura (um pacote por responsabilidade)

```
br.com.fiap.zela
├── model        entidades do domínio + StatusChamado (ciclo de vida)
├── dao          acesso ao banco com JDBC (DataSource no construtor, PreparedStatement)
├── dto          entrada (Request, com Bean Validation) e saída (Response) da API
├── controller   rotas REST, status HTTP e orquestração das regras
├── exception    exceções do domínio (404, 409, 400, 500)
├── handler      @RestControllerAdvice e /error: todo erro vira JSON padronizado
└── config       CORS e ModelMapper
```

Caminho de uma requisição: **Controller** (valida o DTO com `@Valid`) → regra de negócio → **DAO** (JDBC) → Oracle → de volta como **DTO de saída** (ModelMapper).

## Domínio

| Entidade | Tabela | Papel |
| --- | --- | --- |
| Categoria | `tb_zela_categoria` | Tipo de problema, com peso (1 a 5) e prazo em dias |
| Cidadao | `tb_zela_cidadao` | Quem abre e apoia chamados |
| **Chamado** | `tb_zela_chamado` | Raiz do agregado: o problema registrado |
| Atualizacao | `tb_zela_atualizacao` | Histórico do chamado (**1 Chamado : N Atualizações**) |
| Apoio | `tb_zela_apoio` | "Eu também vi isso" (**1 Chamado : N Apoios**) |

Ciclo de vida: `ABERTO → EM_ANALISE → EM_EXECUCAO → RESOLVIDO`. De `ABERTO` ou `EM_ANALISE` também vai para `CANCELADO`.

### Regras de negócio

| Regra | Onde | Resposta |
| --- | --- | --- |
| **RN01** Não pode haver outro chamado **em aberto** (ABERTO, EM_ANALISE ou EM_EXECUCAO) da mesma categoria no mesmo endereço. A API sugere apoiar o existente. | `ChamadoController` + índice único no banco | 409 |
| **RN02** Chamado RESOLVIDO ou CANCELADO não recebe novas atualizações. | `AtualizacaoController` | 409 |
| **RN03** O cidadão não apoia o próprio chamado nem o mesmo chamado duas vezes. | `ApoioController` + `UNIQUE` no banco | 409 |
| **RN04** Prioridade de 1 a 5: começa no peso da categoria e sobe 1 a cada 5 apoios, até 5. | `Chamado.calcularPrioridade` | — |
| **RN05** A nota (1 a 5) só é aceita com o chamado RESOLVIDO. | `ChamadoController` + `CHECK` no banco | 409 |
| Transição de status só segue o fluxo acima. | `StatusChamado.podeIrPara` | 409 |
| Chamado encerrado não recebe apoio. O CANCELADO não é editado e o RESOLVIDO só recebe a nota. | `ApoioController` e `ChamadoController` | 409 |
| A atualização que mudou o status faz parte do histórico e não pode ser removida. | `AtualizacaoController` | 409 |
| O autor do chamado (`cidadaoId`) é fixo: o PUT não troca quem abriu o chamado. | `Chamado.foiAbertoPor` + `ChamadoController` | 409 |
| No chamado RESOLVIDO, o PUT só grava a nota: mudar qualquer outro campo junto é recusado (nada é ignorado em silêncio). | `ChamadoController` | 409 |
| Remover registro que tem filhos (categoria com chamados, chamado com atualizações ou apoios, cidadão com vínculos). | Controllers | 409 |

## Endpoints

Formato dos erros (sempre JSON, nunca página HTML nem stack trace):

```json
{ "timestamp": "2026-11-18T10:15:30", "status": 400, "erro": "Bad Request",
  "mensagem": "Dados inválidos. Corrija os campos indicados.", "caminho": "/chamados",
  "campos": [ { "campo": "descricao", "mensagem": "A descrição deve ter entre 10 e 500 caracteres" } ] }
```

| Recurso | Rotas | Sucesso | Erros |
| --- | --- | --- | --- |
| Categorias | `POST /categorias` · `GET /categorias` · `GET /categorias/{id}` · `PUT /categorias/{id}` · `DELETE /categorias/{id}` | 201+Location · 200 · 200 · 200 · 204 | 400 · 404 · 409 |
| Cidadãos | `POST /cidadaos` · `GET /cidadaos` · `GET /cidadaos/{id}` · `PUT /cidadaos/{id}` · `DELETE /cidadaos/{id}` | 201+Location · 200 · 200 · 200 · 204 | 400 · 404 · 409 |
| Chamados | `POST /chamados` · `GET /chamados?bairro=&categoriaId=&status=` · `GET /chamados/{id}` · `PUT /chamados/{id}` · `DELETE /chamados/{id}` | 201+Location · 200 · 200 · 200 · 204 | 400 · 404 · 409 |
| Atualizações (aninhado) | `GET /chamados/{id}/atualizacoes` · `POST /chamados/{id}/atualizacoes` | 200 · 201+Location | 400 · 404 · 409 |
| Atualizações | `POST /atualizacoes` · `GET /atualizacoes` · `GET /atualizacoes/{id}` · `PUT /atualizacoes/{id}` · `DELETE /atualizacoes/{id}` | 201+Location · 200 · 200 · 200 · 204 | 400 · 404 · 409 |
| Apoios (aninhado) | `GET /chamados/{id}/apoios` · `POST /chamados/{id}/apoios` | 200 · 201+Location | 400 · 404 · 409 |
| Apoios | `POST /apoios` · `GET /apoios` · `GET /apoios/{id}` · `PUT /apoios/{id}` · `DELETE /apoios/{id}` | 201+Location · 200 · 200 · 200 · 204 | 400 · 404 · 409 |
| Saúde | `GET /` · `GET /health` | 200 | — |

Qualquer método não suportado em uma rota devolve **405** (com o cabeçalho `Allow`); rota inexistente devolve **404**; erro inesperado devolve **500** com mensagem genérica. Todos em JSON.

Erros vindos do Oracle também são traduzidos, sem nunca expor o SQL: duplicidade, chave estrangeira e `CHECK` viram **409**; texto maior que a coluna ou campo nulo viram **400**; qualquer outra falha vira **500** genérico, com o detalhe só no log do servidor.

A fila `GET /chamados` vem ordenada por prioridade (maior primeiro) e, em empate, pelo chamado mais antigo. Todo chamado devolvido (lista, busca, cadastro e PUT) traz `apoios`, o total de apoios recebidos, para o front mostrar sem uma chamada extra.

### Exemplo: abrir um chamado

`POST /chamados`

```json
{ "categoriaId": 1, "cidadaoId": 1,
  "descricao": "Buraco grande na faixa da direita da avenida.",
  "endereco": "Avenida Dona Belmira Marin, 900", "bairro": "Grajaú",
  "latitude": -23.7655, "longitude": -46.6978 }
```

Resposta `201 Created` com `Location: /chamados/3`:

```json
{ "id": 3, "protocolo": "ZELA-2026-000003", "categoriaId": 1, "cidadaoId": 1,
  "descricao": "Buraco grande na faixa da direita da avenida.",
  "endereco": "Avenida Dona Belmira Marin, 900", "bairro": "Grajaú",
  "latitude": -23.765500, "longitude": -46.697800,
  "status": "ABERTO", "prioridade": 4, "dataAbertura": "2026-11-18T10:15:30", "prazoPrevisto": "2026-12-03", "nota": null,
  "apoios": 0 }
```

## Como rodar localmente

1. **Banco:** ao subir pela primeira vez, a API (`config/InicializadorBanco`) confere se as tabelas existem e, se não existirem, roda sozinha `01_criar_tabelas.sql` e `02_dados_exemplo.sql`. Para fazer manualmente, no Oracle da FIAP, execute na ordem `sql/01_criar_tabelas.sql` e `sql/02_dados_exemplo.sql` (para recriar do zero, rode antes `sql/00_drop.sql`).
   Se as tabelas já tinham sido criadas com a versão anterior do script, rode só `sql/03_ajuste_textos_char.sql`: ele converte os textos para `VARCHAR2(n CHAR)` sem apagar dados (o limite passa a contar caracteres, igual ao `@Size` dos DTOs).
2. **Variáveis de ambiente** (nunca no código; veja `.env.example`). O Spring Boot **não lê** arquivo `.env` sozinho: defina as variáveis no terminal, na Run Configuration do IntelliJ, no painel do Render ou com `docker run --env-file .env`.

   | Variável | Para que serve |
   | --- | --- |
   | `DB_URL` | URL JDBC do Oracle, ex.: `jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL` |
   | `DB_USER` | usuário do banco |
   | `DB_PASSWORD` | senha do banco |
   | `CORS_ORIGINS` | opcional, ex.: `http://localhost:5173,https://meu-front.vercel.app` (ausente ou vazia: libera todas as origens) |

3. **Subir a API** (Java 17 e Maven):

   ```bash
   mvn spring-boot:run
   ```

   Acesse http://localhost:8080/health e depois http://localhost:8080/categorias (essa já consulta o Oracle).

Com Docker:

```bash
docker build -t zela-api .
docker run -p 8080:8080 -e DB_URL=... -e DB_USER=... -e DB_PASSWORD=... zela-api
```

## Deploy no Render

1. Suba o projeto para o GitHub (o `.gitignore` já exclui `target/` e `.env`).
2. No Render, use **New > Blueprint** e escolha o repositório: o `render.yaml` cria o serviço Docker com health check em `/health`. (Também funciona por **New > Web Service** com **Language: Docker**.)
3. Informe `DB_USER` e `DB_PASSWORD` quando o Render pedir (os valores ficam só no painel). `DB_URL` já vem preenchida.
4. Espere ficar *Live* e teste `https://SUA-URL.onrender.com/health` e `/categorias`.
5. Coloque a URL no topo deste README, na capa do PDF e no front-end do grupo.

## Coleção para testes

`postman/zela.postman_collection.json` tem 47 requisições: o CRUD, os erros 400, 404, 405 e 409, as regras RN01 a RN05, a troca de autor (409) e a edição de chamado RESOLVIDO (409). Importe no Postman ou no Insomnia, ajuste a variável `baseUrl` e rode as pastas em ordem com o banco recém-criado pelos scripts.

## Relatório de testes

`docs/relatorio_testes.md` separa o que foi verificado na revisão (sintaxe, ausência de JPA, credenciais, DAOs x SQL, coleção do Postman) do que o grupo precisa executar (compilação, Oracle, Docker, Render e front).

## Uso de IA generativa

Declaração exigida pela Global Solution:

- **Ferramenta:** Claude (Anthropic).
- **Para quê:** apoio na estruturação do projeto Spring Boot, rascunhos de código, scripts SQL e documentação, explicação de erros, e uma revisão final com correções de regras de negócio e tratamento de erros.
- **O que o grupo fez:** revisou o código e é responsável pelas decisões do projeto; antes da entrega, roda a coleção do Postman contra a API publicada (checklist abaixo). Todos os integrantes devem conseguir explicar cada camada.
- **Revisão final (Claude):** auditoria contra o PDF da GS; correção de integrantes e turmas; campo `apoios` nas respostas de chamado para a integração com o front; documentação, relatório de testes e roteiro de apresentação.

## Checklist antes de entregar no Portal

- [ ] API publicada no Render e respondendo em `/health` e `/categorias`
- [ ] URL da API no topo deste README, no `integrantes.txt`, na capa do PDF e no front-end
- [ ] Vídeo de até 5 minutos no YouTube (não listado), com o front chamando a API, e o link nos mesmos lugares
- [ ] Coleção do Postman rodada contra a URL do Render, todas as requisições passando
- [ ] ZIP único, sem a pasta `target`, enviado na entrega de DDD do Portal do Aluno
