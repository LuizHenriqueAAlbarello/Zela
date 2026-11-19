package br.com.fiap.zela.exception;

/** Falha de acesso ao banco. A causa fica só no log; o cliente recebe 500 com mensagem genérica. */
public class ErroPersistenciaException extends RuntimeException {

    public ErroPersistenciaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
