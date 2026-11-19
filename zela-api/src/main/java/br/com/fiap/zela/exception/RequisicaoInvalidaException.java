package br.com.fiap.zela.exception;

/** Requisição bem formada, mas com dado inválido (ex.: categoriaId que não existe, filtro desconhecido). Vira HTTP 400. */
public class RequisicaoInvalidaException extends RuntimeException {

    public RequisicaoInvalidaException(String mensagem) {
        super(mensagem);
    }
}
