package br.com.fiap.zela.dto;

import jakarta.validation.constraints.Size;

/**
 * Entrada do PUT /apoios/{id}. Só o comentário pode mudar:
 * trocar o chamado ou o cidadão seria outro apoio (RN03).
 */
public class ApoioComentarioRequest {

    @Size(max = 200, message = "O comentário deve ter no máximo 200 caracteres")
    private String comentario;

    public ApoioComentarioRequest() {
    }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

}
