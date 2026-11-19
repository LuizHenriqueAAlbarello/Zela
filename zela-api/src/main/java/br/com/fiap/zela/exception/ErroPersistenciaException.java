package br.com.fiap.zela.exception;

public class ErroPersistenciaException extends RuntimeException {

    public ErroPersistenciaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
