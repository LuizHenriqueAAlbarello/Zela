package br.com.fiap.zela.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ChamadoResponse {

    private Long id;

    private String protocolo;

    private Long categoriaId;

    private Long cidadaoId;

    private String descricao;

    private String endereco;

    private String bairro;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private String status;

    private Integer prioridade;

    private LocalDateTime dataAbertura;

    private LocalDate prazoPrevisto;

    private Integer nota;

    private Integer apoios;

    public ChamadoResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProtocolo() { return protocolo; }
    public void setProtocolo(String protocolo) { this.protocolo = protocolo; }

    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }

    public Long getCidadaoId() { return cidadaoId; }
    public void setCidadaoId(Long cidadaoId) { this.cidadaoId = cidadaoId; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getPrioridade() { return prioridade; }
    public void setPrioridade(Integer prioridade) { this.prioridade = prioridade; }

    public LocalDateTime getDataAbertura() { return dataAbertura; }
    public void setDataAbertura(LocalDateTime dataAbertura) { this.dataAbertura = dataAbertura; }

    public LocalDate getPrazoPrevisto() { return prazoPrevisto; }
    public void setPrazoPrevisto(LocalDate prazoPrevisto) { this.prazoPrevisto = prazoPrevisto; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    public Integer getApoios() { return apoios; }
    public void setApoios(Integer apoios) { this.apoios = apoios; }

}
