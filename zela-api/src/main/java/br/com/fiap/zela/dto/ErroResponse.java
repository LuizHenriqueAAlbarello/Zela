package br.com.fiap.zela.dto;

import br.com.fiap.zela.config.FusoHorario;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

/** Corpo padronizado de TODO erro da API (sempre JSON, nunca HTML, nunca stack trace). */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErroResponse {

    private final LocalDateTime timestamp;
    private final int status;
    private final String erro;
    private final String mensagem;
    private final String caminho;
    private final List<CampoInvalido> campos;

    public ErroResponse(int status, String erro, String mensagem, String caminho, List<CampoInvalido> campos) {
        this.timestamp = FusoHorario.agora();
        this.status = status;
        this.erro = erro;
        this.mensagem = mensagem;
        this.caminho = caminho;
        this.campos = campos;
    }

    public LocalDateTime getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public String getErro() { return erro; }
    public String getMensagem() { return mensagem; }
    public String getCaminho() { return caminho; }
    public List<CampoInvalido> getCampos() { return campos; }
}
