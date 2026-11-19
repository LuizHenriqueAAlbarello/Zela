package br.com.fiap.zela.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class CategoriaRequest {

    @NotBlank(message = "O nome da categoria é obrigatório")
    @Size(max = 80, message = "O nome deve ter no máximo 80 caracteres")
    private String nome;

    @NotNull(message = "O peso é obrigatório")
    @Min(value = 1, message = "O peso mínimo é 1")
    @Max(value = 5, message = "O peso máximo é 5")
    private Integer peso;

    @NotNull(message = "O prazo em dias é obrigatório")
    @Positive(message = "O prazo deve ser maior que zero")
    @Max(value = 365, message = "O prazo máximo é 365 dias")
    private Integer prazoDias;

    public CategoriaRequest() {
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Integer getPeso() { return peso; }
    public void setPeso(Integer peso) { this.peso = peso; }

    public Integer getPrazoDias() { return prazoDias; }
    public void setPrazoDias(Integer prazoDias) { this.prazoDias = prazoDias; }

}
