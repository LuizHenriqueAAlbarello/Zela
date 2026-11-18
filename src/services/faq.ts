import type { ItemFaq } from '../types/faq'

// Perguntas da página FAQ. As respostas seguem as regras de negócio do projeto (RN01 a RN05).
export const PERGUNTAS_FAQ: ItemFaq[] = [
  {
    pergunta: 'Como abro um chamado?',
    resposta:
      'Clique em "Abrir chamado", escolha a categoria do problema (buraco, poste apagado, entulho e outras), informe o endereço e descreva o que está acontecendo. Ao enviar, você recebe o número do protocolo, o prazo previsto e a prioridade.',
  },
  {
    pergunta: 'Preciso criar conta?',
    resposta:
      'Não. Nesta versão do Zela, qualquer pessoa pode abrir e acompanhar chamados sem cadastro.',
  },
  {
    pergunta: 'O que é apoiar um chamado?',
    resposta:
      'É dizer "esse problema também me afeta". Em vez de abrir um pedido repetido, você apoia o que já existe. Os apoios mostram à subprefeitura quantas pessoas são afetadas e aumentam a prioridade do chamado.',
  },
  {
    pergunta: 'Por que não consigo abrir um chamado igual a outro?',
    resposta:
      'Não podem existir dois chamados abertos da mesma categoria no mesmo endereço. Se já houver um, o Zela mostra o chamado existente e oferece a opção de apoiá-lo. Assim os pedidos não se espalham e ganham força juntos.',
  },
  {
    pergunta: 'Como a prioridade é calculada?',
    resposta:
      'A prioridade vai de 1 a 5. Ela começa no peso da categoria (uma árvore com risco começa mais alta que um poste apagado) e sobe 1 ponto a cada 5 apoios, até chegar a 5.',
  },
  {
    pergunta: 'O que a IA faz?',
    resposta:
      'Ela estima o prazo previsto de cada chamado, ajuda a ordenar a fila por urgência e aponta as zonas da cidade onde a espera costuma ser maior.',
  },
  {
    pergunta: 'Quanto tempo leva para resolver?',
    resposta:
      'Depende da categoria. Árvore com risco tem o prazo mais curto (3 dias) e calçada danificada o mais longo (30 dias). O prazo previsto aparece no chamado logo depois de ele ser aberto.',
  },
  {
    pergunta: 'Posso avaliar o atendimento?',
    resposta:
      'Sim. Quando o chamado chega ao status Resolvido, você pode dar uma nota de 1 a 5. Antes disso a avaliação não é aceita, porque o serviço ainda não terminou.',
  },
  {
    pergunta: 'O Zela substitui o SP156?',
    resposta:
      'Não. O Zela é um protótipo acadêmico feito por alunos da FIAP. Para pedidos oficiais à Prefeitura de São Paulo, continue usando o SP156.',
  },
  {
    pergunta: 'Em emergência, o que eu faço?',
    resposta:
      'Não use o Zela. Ligue para a Defesa Civil (199) em caso de árvore caindo, alagamento ou deslizamento, e para os Bombeiros (193) em caso de incêndio ou pessoa em risco.',
  },
]
