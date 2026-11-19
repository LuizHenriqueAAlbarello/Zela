package br.com.fiap.zela.model;

/**
 * Categoria do problema urbano (buraco, iluminação...). Define peso inicial da prioridade e prazo em dias.
 */
public class Categoria {

    private Long id;

    private String nome;

    private Integer peso;

    private Integer prazoDias;

    public Categoria() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Integer getPeso() { return peso; }
    public void setPeso(Integer peso) { this.peso = peso; }

    public Integer getPrazoDias() { return prazoDias; }
    public void setPrazoDias(Integer prazoDias) { this.prazoDias = prazoDias; }

}
