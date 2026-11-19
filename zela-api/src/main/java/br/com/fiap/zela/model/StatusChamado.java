package br.com.fiap.zela.model;

/**
 * Ciclo de vida do chamado (igual em Java, Python e no banco):
 * ABERTO -> EM_ANALISE -> EM_EXECUCAO -> RESOLVIDO.
 * De ABERTO ou EM_ANALISE também pode ir para CANCELADO.
 */
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
