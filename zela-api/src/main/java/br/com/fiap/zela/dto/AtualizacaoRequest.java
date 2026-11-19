package br.com.fiap.zela.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class AtualizacaoRequest {

    @Positive(message = "O id do chamado deve ser positivo")
    private Long chamadoId;

    @NotBlank(message = "A mensagem é obrigatória")
    @Size(max = 500, message = "A mensagem deve ter no máximo 500 caracteres")
    private String mensagem;

    @NotBlank(message = "O autor é obrigatório")
    @Size(max = 100, message = "O autor deve ter no máximo 100 caracteres")
    private String autor;

    @Pattern(regexp = "ABERTO|EM_ANALISE|EM_EXECUCAO|RESOLVIDO|CANCELADO", message = "Status inválido. Use ABERTO, EM_ANALISE, EM_EXECUCAO, RESOLVIDO ou CANCELADO")
    private String novoStatus;

    public AtualizacaoRequest() {
    }

    public Long getChamadoId() { return chamadoId; }
    public void setChamadoId(Long chamadoId) { this.chamadoId = chamadoId; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public String getNovoStatus() { return novoStatus; }
    public void setNovoStatus(String novoStatus) { this.novoStatus = novoStatus; }

}
