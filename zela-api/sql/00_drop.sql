-- Zela | Limpeza (use só para recriar do zero). Ordem: filhos antes dos pais.
DROP TABLE tb_zela_apoio       CASCADE CONSTRAINTS;
DROP TABLE tb_zela_atualizacao CASCADE CONSTRAINTS;
DROP TABLE tb_zela_chamado     CASCADE CONSTRAINTS;
DROP TABLE tb_zela_cidadao     CASCADE CONSTRAINTS;
DROP TABLE tb_zela_categoria   CASCADE CONSTRAINTS;

DROP SEQUENCE sq_tb_zela_apoio;
DROP SEQUENCE sq_tb_zela_atualizacao;
DROP SEQUENCE sq_tb_zela_chamado;
DROP SEQUENCE sq_tb_zela_cidadao;
DROP SEQUENCE sq_tb_zela_categoria;
