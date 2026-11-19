package br.com.fiap.zela.dto;

public class CidadaoResponse {

    private Long id;

    private String nome;

    private String email;

    public CidadaoResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

}
