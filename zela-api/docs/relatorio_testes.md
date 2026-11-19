# Relatório de testes — Zela API (DDD Using Java)

Revisão final: 18/11/2026. O relatório separa o que **foi executado** do que **ainda precisa ser executado** pelo grupo. Nenhum resultado aqui foi presumido.

## 1. Verificações executadas na revisão

| # | Verificação | Como | Resultado |
|---|---|---|---|
| 1 | Sintaxe dos 42 arquivos Java | Analisador `javalang` | 39 lidos sem erro. Os outros 3 (`CorsConfig`, `GlobalExceptionHandler`, `ErroPadraoController`) usam recursos do Java 16+ (`instanceof` com variável, `String[]::new`) que o analisador não reconhece. São válidos em Java 17. |
| 2 | Ausência de JPA, Hibernate e Spring Data | Busca no `pom.xml` e em `src` | Nenhum uso. A única ocorrência é o comentário do `pom.xml` explicando que o starter JDBC só fornece o DataSource. |
| 3 | Credenciais no código | Busca por usuário, senha e `rm` com dígitos em todos os arquivos, incluindo Postman e PDF | Nenhuma. `application.properties` usa `${DB_URL}`, `${DB_USER}` e `${DB_PASSWORD}`. |
| 4 | DAOs x script SQL | Script que compara as tabelas, sequences e colunas citadas nos DAOs com o `01_criar_tabelas.sql` | 5 tabelas, 5 sequences, nenhuma divergência. |
| 5 | Consultas parametrizadas | Busca por `createStatement` e concatenação de entrada do usuário | 38 `prepareStatement`. Os filtros entram por `?`. A única concatenação é o nome da sequence, que vem de constante do DAO. |
| 6 | Coleção do Postman | Leitura do JSON | Válida, com 47 requisições. A requisição "Abrir chamado" passou a conferir também `apoios = 0`. |
| 7 | Contrato com o front | Comparação com o repositório do front | O front ainda não chama a API (ver seção 3). |

## 2. Testes que precisam ser executados pelo grupo

Não foram executados aqui: o ambiente da revisão não tem acesso ao repositório do Maven, ao Oracle da FIAP nem ao Render.

| # | Teste | Comando ou passo | Esperado |
|---|---|---|---|
| 1 | Compilação | `mvn clean package` | `BUILD SUCCESS` e o arquivo `target/zela-api.jar` gerado |
| 2 | Banco | Rodar `sql/00_drop.sql` (se precisar), `01_criar_tabelas.sql` e `02_dados_exemplo.sql` no Oracle FIAP | 5 tabelas, 7 categorias, 3 cidadãos e 2 chamados |
| 3 | Subida local | `mvn spring-boot:run` com as variáveis de ambiente | `GET /health` responde 200 e `GET /categorias` lista as 7 |
| 4 | Coleção Postman local | Rodar a coleção inteira com `baseUrl=http://localhost:8080` e o banco recém-criado | 47 de 47 passando |
| 5 | Docker | `docker build -t zela-api .` e `docker run --env-file .env -p 8080:8080 zela-api` | Mesmo resultado do teste 3 |
| 6 | Render | Deploy pelo `render.yaml` e `GET https://SUA-URL.onrender.com/health` | 200 |
| 7 | Coleção Postman no Render | `baseUrl` = URL do Render | 47 de 47 passando |
| 8 | Front | Lista e cadastro de chamados no front apontando para a URL do Render | O chamado criado no front aparece no `GET /chamados` |

Cenários de erro já cobertos pela coleção: 400 (peso 9, e-mail inválido, descrição curta, status desconhecido), 404 (id inexistente e histórico de chamado inexistente), 405 (PATCH), 409 (RN01 a RN05, nome e e-mail duplicados, transição inválida, troca de autor, edição de chamado RESOLVIDO, remoção com filhos). O 500 só aparece com falha real, por exemplo com o banco fora do ar: o corpo traz a mensagem genérica, sem SQL.

## 3. Pendências que não são de código

1. **URL do Render:** sem ela, a correção pode aplicar −10 (API fora do ar ou link quebrado) e zerar o critério de deploy.
2. **Vídeo:** até 5 minutos, YouTube não listado, mostrando o front funcionando com a API.
3. **Integração do front:** o repositório do front ainda não tem chamadas à API. As páginas de lista e cadastro precisam usar `GET /chamados` e `POST /chamados`.
4. Depois de ter os links: colocar a URL e o vídeo no `README.md`, no `integrantes.txt` e na capa do PDF.
