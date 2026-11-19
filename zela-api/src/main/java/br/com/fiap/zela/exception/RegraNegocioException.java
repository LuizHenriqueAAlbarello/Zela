package br.com.fiap.zela.exception;

/** Regra de negócio do domínio violada (RN01 a RN05, transição de status, remoção com filhos). Vira HTTP 409. */
public class RegraNegocioException extends RuntimeException {

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
