package br.com.fiap.zela.model;

import java.time.LocalDateTime;

public class Apoio {

    private Long id;

    private Long chamadoId;

    private Long cidadaoId;

    private String comentario;

    private LocalDateTime dataApoio;

    public Apoio() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getChamadoId() { return chamadoId; }
    public void setChamadoId(Long chamadoId) { this.chamadoId = chamadoId; }

    public Long getCidadaoId() { return cidadaoId; }
    public void setCidadaoId(Long cidadaoId) { this.cidadaoId = cidadaoId; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public LocalDateTime getDataApoio() { return dataApoio; }
    public void setDataApoio(LocalDateTime dataApoio) { this.dataApoio = dataApoio; }

}
