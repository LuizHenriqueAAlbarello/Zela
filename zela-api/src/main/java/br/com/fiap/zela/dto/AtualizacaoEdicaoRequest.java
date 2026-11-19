package br.com.fiap.zela.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Entrada do PUT /atualizacoes/{id}. Só a mensagem e o autor podem ser corrigidos:
 * o status registrado e o chamado não mudam, para o histórico continuar fiel ao ciclo de vida.
 */
public class AtualizacaoEdicaoRequest {

    @NotBlank(message = "A mensagem é obrigatória")
    @Size(max = 500, message = "A mensagem deve ter no máximo 500 caracteres")
    private String mensagem;

    @NotBlank(message = "O autor é obrigatório")
    @Size(max = 100, message = "O autor deve ter no máximo 100 caracteres")
    private String autor;

    public AtualizacaoEdicaoRequest() {
    }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

}
