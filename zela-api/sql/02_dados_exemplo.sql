-- Zela | Dados de exemplo (rode DEPOIS de 01_criar_tabelas.sql, com as sequences recém-criadas)
-- As 7 categorias abaixo vêm do documento do projeto (peso e prazo).

INSERT INTO tb_zela_categoria VALUES (sq_tb_zela_categoria.NEXTVAL, 'Buraco na via', 4, 15);
INSERT INTO tb_zela_categoria VALUES (sq_tb_zela_categoria.NEXTVAL, 'Iluminação pública', 3, 7);
INSERT INTO tb_zela_categoria VALUES (sq_tb_zela_categoria.NEXTVAL, 'Lixo e entulho', 3, 5);
INSERT INTO tb_zela_categoria VALUES (sq_tb_zela_categoria.NEXTVAL, 'Árvore caída ou com risco', 5, 3);
INSERT INTO tb_zela_categoria VALUES (sq_tb_zela_categoria.NEXTVAL, 'Calçada danificada', 3, 30);
INSERT INTO tb_zela_categoria VALUES (sq_tb_zela_categoria.NEXTVAL, 'Sinalização', 4, 10);
INSERT INTO tb_zela_categoria VALUES (sq_tb_zela_categoria.NEXTVAL, 'Boca de lobo entupida', 4, 7);

-- Personas do documento: Dona Maria, Lucas e Carla (gestora)
INSERT INTO tb_zela_cidadao VALUES (sq_tb_zela_cidadao.NEXTVAL, 'Maria das Dores', 'maria.dores@exemplo.com');
INSERT INTO tb_zela_cidadao VALUES (sq_tb_zela_cidadao.NEXTVAL, 'Lucas Ferreira', 'lucas.ferreira@exemplo.com');
INSERT INTO tb_zela_cidadao VALUES (sq_tb_zela_cidadao.NEXTVAL, 'Carla Nogueira', 'carla.nogueira@exemplo.com');

-- Chamado 1: calçada quebrada da Dona Maria (peso 3, prazo 30 dias)
INSERT INTO tb_zela_chamado (cd_chamado, nr_protocolo, cd_categoria, cd_cidadao, ds_chamado, ds_endereco, nm_bairro,
                             st_chamado, nr_prioridade, dt_abertura, dt_prazo_previsto)
VALUES (sq_tb_zela_chamado.NEXTVAL, 'ZELA-2026-000001',
        (SELECT cd_categoria FROM tb_zela_categoria WHERE nm_categoria = 'Calçada danificada'),
        (SELECT cd_cidadao FROM tb_zela_cidadao WHERE ds_email = 'maria.dores@exemplo.com'),
        'Calçada quebrada em frente ao posto de saúde, risco de queda para idosos.',
        'Rua das Palmeiras, 120', 'Grajaú', 'ABERTO', 3, SYSTIMESTAMP, TRUNC(SYSDATE) + 30);

-- Chamado 2: buraco do Lucas (peso 4, prazo 15 dias)
INSERT INTO tb_zela_chamado (cd_chamado, nr_protocolo, cd_categoria, cd_cidadao, ds_chamado, ds_endereco, nm_bairro,
                             st_chamado, nr_prioridade, dt_abertura, dt_prazo_previsto)
VALUES (sq_tb_zela_chamado.NEXTVAL, 'ZELA-2026-000002',
        (SELECT cd_categoria FROM tb_zela_categoria WHERE nm_categoria = 'Buraco na via'),
        (SELECT cd_cidadao FROM tb_zela_cidadao WHERE ds_email = 'lucas.ferreira@exemplo.com'),
        'Buraco grande na faixa da direita, motos desviam para a contramão.',
        'Avenida Dona Belmira Marin, 800', 'Grajaú', 'EM_ANALISE', 4, SYSTIMESTAMP, TRUNC(SYSDATE) + 15);

-- Histórico do chamado 2 (relacionamento 1:N)
INSERT INTO tb_zela_atualizacao (cd_atualizacao, cd_chamado, ds_mensagem, nm_autor, st_novo, dt_atualizacao)
VALUES (sq_tb_zela_atualizacao.NEXTVAL,
        (SELECT cd_chamado FROM tb_zela_chamado WHERE nr_protocolo = 'ZELA-2026-000002'), 'Equipe técnica fará a vistoria amanhã.', 'Carla Nogueira', 'EM_ANALISE', SYSTIMESTAMP);

-- Apoio da Dona Maria ao buraco do Lucas
INSERT INTO tb_zela_apoio (cd_apoio, cd_chamado, cd_cidadao, ds_comentario, dt_apoio)
VALUES (sq_tb_zela_apoio.NEXTVAL,
        (SELECT cd_chamado FROM tb_zela_chamado WHERE nr_protocolo = 'ZELA-2026-000002'),
        (SELECT cd_cidadao FROM tb_zela_cidadao WHERE ds_email = 'maria.dores@exemplo.com'),
        'Também passo por aqui todo dia.', SYSTIMESTAMP);

COMMIT;
