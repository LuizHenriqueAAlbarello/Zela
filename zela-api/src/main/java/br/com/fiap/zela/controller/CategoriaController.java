package br.com.fiap.zela.controller;

import br.com.fiap.zela.dao.CategoriaDao;
import br.com.fiap.zela.dto.CategoriaRequest;
import br.com.fiap.zela.dto.CategoriaResponse;
import br.com.fiap.zela.exception.RecursoNaoEncontradoException;
import br.com.fiap.zela.exception.RegraNegocioException;
import br.com.fiap.zela.model.Categoria;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaDao categoriaDao;
    private final ModelMapper mapper;

    public CategoriaController(CategoriaDao categoriaDao, ModelMapper mapper) {
        this.categoriaDao = categoriaDao;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> cadastrar(@Valid @RequestBody CategoriaRequest request) {
        request.setNome(request.getNome().trim());
        if (categoriaDao.existeNome(request.getNome(), 0L)) {
            throw new RegraNegocioException("Já existe uma categoria chamada '" + request.getNome() + "'.");
        }
        Categoria nova = categoriaDao.inserir(mapper.map(request, Categoria.class));
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/categorias/{id}").buildAndExpand(nova.getId()).toUri();
        return ResponseEntity.created(location).body(mapper.map(nova, CategoriaResponse.class));
    }

    @GetMapping
    public List<CategoriaResponse> listar() {
        return categoriaDao.listar().stream()
                .map(c -> mapper.map(c, CategoriaResponse.class))
                .toList();
    }

    @GetMapping("/{id}")
    public CategoriaResponse buscar(@PathVariable Long id) {
        return mapper.map(buscarOuFalhar(id), CategoriaResponse.class);
    }

    @PutMapping("/{id}")
    public CategoriaResponse atualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        Categoria atual = buscarOuFalhar(id);
        request.setNome(request.getNome().trim());
        if (categoriaDao.existeNome(request.getNome(), id)) {
            throw new RegraNegocioException("Já existe outra categoria chamada '" + request.getNome() + "'.");
        }
        atual.setNome(request.getNome());
        atual.setPeso(request.getPeso());
        atual.setPrazoDias(request.getPrazoDias());
        categoriaDao.atualizar(atual);
        return mapper.map(atual, CategoriaResponse.class);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        buscarOuFalhar(id);
        if (categoriaDao.possuiChamados(id)) {
            throw new RegraNegocioException("A categoria possui chamados e não pode ser removida.");
        }
        categoriaDao.remover(id);
        return ResponseEntity.noContent().build();
    }

    private Categoria buscarOuFalhar(Long id) {
        return categoriaDao.buscarPorId(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria", id));
    }
}
