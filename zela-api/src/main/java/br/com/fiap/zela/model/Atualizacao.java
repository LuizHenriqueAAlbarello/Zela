package br.com.fiap.zela.model;

import java.time.LocalDateTime;

public class Atualizacao {

    private Long id;

    private Long chamadoId;

    private String mensagem;

    private String autor;

    private StatusChamado novoStatus;

    private LocalDateTime dataAtualizacao;

    public Atualizacao() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getChamadoId() { return chamadoId; }
    public void setChamadoId(Long chamadoId) { this.chamadoId = chamadoId; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public StatusChamado getNovoStatus() { return novoStatus; }
    public void setNovoStatus(StatusChamado novoStatus) { this.novoStatus = novoStatus; }

    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }

}
