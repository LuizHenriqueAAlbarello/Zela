package br.com.fiap.zela.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Raiz do agregado: um problema do espaço público registrado por um cidadão.
 */
public class Chamado {

    private Long id;

    private String protocolo;

    private Long categoriaId;

    private Long cidadaoId;

    private String descricao;

    private String endereco;

    private String bairro;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private StatusChamado status;

    private Integer prioridade;

    private LocalDateTime dataAbertura;

    private LocalDate prazoPrevisto;

    private Integer nota;

    public Chamado() {
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

    public StatusChamado getStatus() { return status; }
    public void setStatus(StatusChamado status) { this.status = status; }

    public Integer getPrioridade() { return prioridade; }
    public void setPrioridade(Integer prioridade) { this.prioridade = prioridade; }

    public LocalDateTime getDataAbertura() { return dataAbertura; }
    public void setDataAbertura(LocalDateTime dataAbertura) { this.dataAbertura = dataAbertura; }

    public LocalDate getPrazoPrevisto() { return prazoPrevisto; }
    public void setPrazoPrevisto(LocalDate prazoPrevisto) { this.prazoPrevisto = prazoPrevisto; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    /** RN04: prioridade = peso da categoria + 1 a cada 5 apoios, limitada a 5. */
    public static int calcularPrioridade(int pesoCategoria, int totalApoios) {
        return Math.min(5, pesoCategoria + (totalApoios / 5));
    }

    /** RESOLVIDO e CANCELADO são estados finais do ciclo de vida. */
    public boolean encerrado() {
        return status != null && status.encerrado();
    }

    /** O autor do chamado é fixo: usado na RN03 (não apoiar o próprio) e para impedir troca de autor no PUT. */
    public boolean foiAbertoPor(Long idCidadao) {
        return idCidadao != null && idCidadao.equals(cidadaoId);
    }

    /** RN05: só chamado RESOLVIDO aceita nota de avaliação. */
    public boolean aceitaAvaliacao() {
        return status == StatusChamado.RESOLVIDO;
    }

}
