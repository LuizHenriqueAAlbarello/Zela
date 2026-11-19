-- =====================================================================
-- Zela - Zeladoria Colaborativa | Global Solution 2026/2 CitizenTech
-- Script de criação: tabelas, sequences, chaves e regras no banco (Oracle)
-- Padrão: tb_nome, colunas cd_/nm_/ds_/nr_/st_/dt_, sequence sq_tb_nome
-- Textos em VARCHAR2(n CHAR): o limite conta CARACTERES, igual ao @Size dos DTOs
-- (com acentos, VARCHAR2(n) em bytes estouraria antes do limite validado pela API).
-- =====================================================================

-- ---------- Sequences ----------
CREATE SEQUENCE sq_tb_zela_categoria   START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE sq_tb_zela_cidadao     START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE sq_tb_zela_chamado     START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE sq_tb_zela_atualizacao START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE sq_tb_zela_apoio       START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- ---------- Categoria: peso da prioridade e prazo previsto ----------
CREATE TABLE tb_zela_categoria (
    cd_categoria   NUMBER(10)    NOT NULL,
    nm_categoria   VARCHAR2(80 CHAR)  NOT NULL,
    nr_peso        NUMBER(1)     NOT NULL,
    nr_prazo_dias  NUMBER(3)     NOT NULL,
    CONSTRAINT pk_tb_zela_categoria PRIMARY KEY (cd_categoria),
    CONSTRAINT uq_zela_categoria_nome UNIQUE (nm_categoria),
    CONSTRAINT ck_zela_categoria_peso CHECK (nr_peso BETWEEN 1 AND 5),
    CONSTRAINT ck_zela_categoria_prazo CHECK (nr_prazo_dias > 0)
);

-- ---------- Cidadão ----------
CREATE TABLE tb_zela_cidadao (
    cd_cidadao  NUMBER(10)    NOT NULL,
    nm_cidadao  VARCHAR2(100 CHAR) NOT NULL,
    ds_email    VARCHAR2(120 CHAR) NOT NULL,
    CONSTRAINT pk_tb_zela_cidadao PRIMARY KEY (cd_cidadao),
    CONSTRAINT uq_zela_cidadao_email UNIQUE (ds_email)
);

-- ---------- Chamado (raiz do agregado) ----------
CREATE TABLE tb_zela_chamado (
    cd_chamado         NUMBER(10)     NOT NULL,
    nr_protocolo       VARCHAR2(20 CHAR)   NOT NULL,
    cd_categoria       NUMBER(10)     NOT NULL,
    cd_cidadao         NUMBER(10)     NOT NULL,
    ds_chamado         VARCHAR2(500 CHAR)  NOT NULL,
    ds_endereco        VARCHAR2(200 CHAR)  NOT NULL,
    nm_bairro          VARCHAR2(80 CHAR)   NOT NULL,
    nr_latitude        NUMBER(9,6),
    nr_longitude       NUMBER(9,6),
    st_chamado         VARCHAR2(15 CHAR)   DEFAULT 'ABERTO' NOT NULL,
    nr_prioridade      NUMBER(1)      NOT NULL,
    dt_abertura        TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
    dt_prazo_previsto  DATE           NOT NULL,
    nr_nota            NUMBER(1),
    CONSTRAINT pk_tb_zela_chamado PRIMARY KEY (cd_chamado),
    CONSTRAINT uq_zela_chamado_protocolo UNIQUE (nr_protocolo),
    CONSTRAINT fk_zela_chamado_categoria FOREIGN KEY (cd_categoria) REFERENCES tb_zela_categoria (cd_categoria),
    CONSTRAINT fk_zela_chamado_cidadao   FOREIGN KEY (cd_cidadao)   REFERENCES tb_zela_cidadao (cd_cidadao),
    CONSTRAINT ck_zela_chamado_status CHECK (st_chamado IN ('ABERTO','EM_ANALISE','EM_EXECUCAO','RESOLVIDO','CANCELADO')),
    CONSTRAINT ck_zela_chamado_prioridade CHECK (nr_prioridade BETWEEN 1 AND 5),
    CONSTRAINT ck_zela_chamado_nota CHECK (nr_nota BETWEEN 1 AND 5),
    -- RN05: a nota de avaliação só existe quando o chamado está RESOLVIDO
    CONSTRAINT ck_zela_chamado_nota_resolvido CHECK (nr_nota IS NULL OR st_chamado = 'RESOLVIDO'),
    CONSTRAINT ck_zela_chamado_lat CHECK (nr_latitude BETWEEN -90 AND 90),
    CONSTRAINT ck_zela_chamado_lon CHECK (nr_longitude BETWEEN -180 AND 180)
);

-- ---------- Atualização (histórico) : N chamados 1 -> N atualizações ----------
CREATE TABLE tb_zela_atualizacao (
    cd_atualizacao  NUMBER(10)     NOT NULL,
    cd_chamado      NUMBER(10)     NOT NULL,
    ds_mensagem     VARCHAR2(500 CHAR)  NOT NULL,
    nm_autor        VARCHAR2(100 CHAR)  NOT NULL,
    st_novo         VARCHAR2(15 CHAR),
    dt_atualizacao  TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT pk_tb_zela_atualizacao PRIMARY KEY (cd_atualizacao),
    CONSTRAINT fk_zela_atualizacao_chamado FOREIGN KEY (cd_chamado) REFERENCES tb_zela_chamado (cd_chamado),
    CONSTRAINT ck_zela_atualizacao_status CHECK (st_novo IS NULL
        OR st_novo IN ('ABERTO','EM_ANALISE','EM_EXECUCAO','RESOLVIDO','CANCELADO'))
);

-- ---------- Apoio ("eu também vi isso") ----------
CREATE TABLE tb_zela_apoio (
    cd_apoio       NUMBER(10)    NOT NULL,
    cd_chamado     NUMBER(10)    NOT NULL,
    cd_cidadao     NUMBER(10)    NOT NULL,
    ds_comentario  VARCHAR2(200 CHAR),
    dt_apoio       TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT pk_tb_zela_apoio PRIMARY KEY (cd_apoio),
    CONSTRAINT fk_zela_apoio_chamado FOREIGN KEY (cd_chamado) REFERENCES tb_zela_chamado (cd_chamado),
    CONSTRAINT fk_zela_apoio_cidadao FOREIGN KEY (cd_cidadao) REFERENCES tb_zela_cidadao (cd_cidadao),
    -- RN03 (parte 2): o mesmo cidadão não apoia o mesmo chamado duas vezes
    CONSTRAINT uq_zela_apoio_chamado_cidadao UNIQUE (cd_chamado, cd_cidadao)
);

-- ---------- Índices de apoio às consultas ----------
CREATE INDEX ix_zela_chamado_categoria ON tb_zela_chamado (cd_categoria);
CREATE INDEX ix_zela_chamado_cidadao   ON tb_zela_chamado (cd_cidadao);
CREATE INDEX ix_zela_chamado_fila      ON tb_zela_chamado (nr_prioridade, dt_abertura);
CREATE INDEX ix_zela_atualizacao_cham  ON tb_zela_atualizacao (cd_chamado);
CREATE INDEX ix_zela_apoio_cidadao     ON tb_zela_apoio (cd_cidadao);

-- ---------- RN01 no banco (OPCIONAL) ----------
-- Impede dois chamados EM ABERTO da mesma categoria no mesmo endereço, mesmo que alguém grave direto no banco.
-- Se o seu usuário não tiver permissão para índice baseado em função, pule este comando: a API já valida a RN01.
CREATE UNIQUE INDEX ux_zela_chamado_aberto ON tb_zela_chamado (
    CASE WHEN st_chamado IN ('ABERTO','EM_ANALISE','EM_EXECUCAO') THEN cd_categoria END,
    CASE WHEN st_chamado IN ('ABERTO','EM_ANALISE','EM_EXECUCAO') THEN UPPER(TRIM(ds_endereco)) END
);

COMMIT;
