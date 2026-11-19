-- Zela | Ajuste para quem JÁ criou as tabelas com a versão anterior do 01_criar_tabelas.sql.
-- Converte os textos para VARCHAR2(n CHAR) sem apagar dados. Banco novo: NÃO precisa rodar este script.
-- O índice da RN01 usa ds_endereco numa função: o Oracle não altera a coluna com ele ativo (ORA-30556).
-- Por isso ele é removido e recriado. Se o grupo não criou esse índice, o DROP dá erro e pode ser ignorado.

DROP INDEX ux_zela_chamado_aberto;

ALTER TABLE tb_zela_categoria MODIFY (nm_categoria VARCHAR2(80 CHAR));
ALTER TABLE tb_zela_cidadao MODIFY (nm_cidadao VARCHAR2(100 CHAR));
ALTER TABLE tb_zela_cidadao MODIFY (ds_email VARCHAR2(120 CHAR));
ALTER TABLE tb_zela_chamado MODIFY (nr_protocolo VARCHAR2(20 CHAR));
ALTER TABLE tb_zela_chamado MODIFY (ds_chamado VARCHAR2(500 CHAR));
ALTER TABLE tb_zela_chamado MODIFY (ds_endereco VARCHAR2(200 CHAR));
ALTER TABLE tb_zela_chamado MODIFY (nm_bairro VARCHAR2(80 CHAR));
ALTER TABLE tb_zela_chamado MODIFY (st_chamado VARCHAR2(15 CHAR));
ALTER TABLE tb_zela_atualizacao MODIFY (ds_mensagem VARCHAR2(500 CHAR));
ALTER TABLE tb_zela_atualizacao MODIFY (nm_autor VARCHAR2(100 CHAR));
ALTER TABLE tb_zela_atualizacao MODIFY (st_novo VARCHAR2(15 CHAR));
ALTER TABLE tb_zela_apoio MODIFY (ds_comentario VARCHAR2(200 CHAR));

CREATE UNIQUE INDEX ux_zela_chamado_aberto ON tb_zela_chamado (
    CASE WHEN st_chamado IN ('ABERTO','EM_ANALISE','EM_EXECUCAO') THEN cd_categoria END,
    CASE WHEN st_chamado IN ('ABERTO','EM_ANALISE','EM_EXECUCAO') THEN UPPER(TRIM(ds_endereco)) END
);

COMMIT;
