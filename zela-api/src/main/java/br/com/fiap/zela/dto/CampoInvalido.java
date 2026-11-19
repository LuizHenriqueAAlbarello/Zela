package br.com.fiap.zela.dto;

public class CampoInvalido {

    private final String campo;
    private final String mensagem;

    public CampoInvalido(String campo, String mensagem) {
        this.campo = campo;
        this.mensagem = mensagem;
    }

    public String getCampo() { return campo; }
    public String getMensagem() { return mensagem; }
}
