package br.com.fiap.zela.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class ChamadoRequest {

    @NotNull(message = "A categoria é obrigatória")
    @Positive(message = "O id da categoria deve ser positivo")
    private Long categoriaId;

    @NotNull(message = "O cidadão é obrigatório")
    @Positive(message = "O id do cidadão deve ser positivo")
    private Long cidadaoId;

    @NotBlank(message = "A descrição é obrigatória")
    @Size(min = 10, max = 500, message = "A descrição deve ter entre 10 e 500 caracteres")
    private String descricao;

    @NotBlank(message = "O endereço é obrigatório")
    @Size(max = 200, message = "O endereço deve ter no máximo 200 caracteres")
    private String endereco;

    @NotBlank(message = "O bairro é obrigatório")
    @Size(max = 80, message = "O bairro deve ter no máximo 80 caracteres")
    private String bairro;

    @DecimalMin(value = "-90.0", message = "Latitude mínima: -90")
    @DecimalMax(value = "90.0", message = "Latitude máxima: 90")
    private BigDecimal latitude;

    @DecimalMin(value = "-180.0", message = "Longitude mínima: -180")
    @DecimalMax(value = "180.0", message = "Longitude máxima: 180")
    private BigDecimal longitude;

    @Min(value = 1, message = "A nota mínima é 1")
    @Max(value = 5, message = "A nota máxima é 5")
    private Integer nota;

    public ChamadoRequest() {
    }

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

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

}
