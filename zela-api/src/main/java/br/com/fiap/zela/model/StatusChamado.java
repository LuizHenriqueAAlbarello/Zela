package br.com.fiap.zela.model;

public enum StatusChamado {
    ABERTO,
    EM_ANALISE,
    EM_EXECUCAO,
    RESOLVIDO,
    CANCELADO;

    public boolean encerrado() {
        return this == RESOLVIDO || this == CANCELADO;
    }

    public boolean podeIrPara(StatusChamado novo) {
        if (novo == null) {
            return false;
        }
        switch (this) {
            case ABERTO:
                return novo == EM_ANALISE || novo == CANCELADO;
            case EM_ANALISE:
                return novo == EM_EXECUCAO || novo == CANCELADO;
            case EM_EXECUCAO:
                return novo == RESOLVIDO;
            default:
                return false;
        }
    }
}
