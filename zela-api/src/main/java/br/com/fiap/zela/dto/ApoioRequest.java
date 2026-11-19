package br.com.fiap.zela.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class ApoioRequest {

    @Positive(message = "O id do chamado deve ser positivo")
    private Long chamadoId;

    @NotNull(message = "O cidadão é obrigatório")
    @Positive(message = "O id do cidadão deve ser positivo")
    private Long cidadaoId;

    @Size(max = 200, message = "O comentário deve ter no máximo 200 caracteres")
    private String comentario;

    public ApoioRequest() {
    }

    public Long getChamadoId() { return chamadoId; }
    public void setChamadoId(Long chamadoId) { this.chamadoId = chamadoId; }

    public Long getCidadaoId() { return cidadaoId; }
    public void setCidadaoId(Long cidadaoId) { this.cidadaoId = cidadaoId; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

}
