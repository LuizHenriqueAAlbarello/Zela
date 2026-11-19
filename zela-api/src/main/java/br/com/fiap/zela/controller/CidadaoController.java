package br.com.fiap.zela.controller;

import br.com.fiap.zela.dao.CidadaoDao;
import br.com.fiap.zela.dto.CidadaoRequest;
import br.com.fiap.zela.dto.CidadaoResponse;
import br.com.fiap.zela.exception.RecursoNaoEncontradoException;
import br.com.fiap.zela.exception.RegraNegocioException;
import br.com.fiap.zela.model.Cidadao;
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
@RequestMapping("/cidadaos")
public class CidadaoController {

    private final CidadaoDao cidadaoDao;
    private final ModelMapper mapper;

    public CidadaoController(CidadaoDao cidadaoDao, ModelMapper mapper) {
        this.cidadaoDao = cidadaoDao;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<CidadaoResponse> cadastrar(@Valid @RequestBody CidadaoRequest request) {
        request.setNome(request.getNome().trim());
        request.setEmail(request.getEmail().trim());
        if (cidadaoDao.existeEmail(request.getEmail(), 0L)) {
            throw new RegraNegocioException("Já existe um cidadão com o e-mail " + request.getEmail() + ".");
        }
        Cidadao novo = cidadaoDao.inserir(mapper.map(request, Cidadao.class));
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/cidadaos/{id}").buildAndExpand(novo.getId()).toUri();
        return ResponseEntity.created(location).body(mapper.map(novo, CidadaoResponse.class));
    }

    @GetMapping
    public List<CidadaoResponse> listar() {
        return cidadaoDao.listar().stream()
                .map(c -> mapper.map(c, CidadaoResponse.class))
                .toList();
    }

    @GetMapping("/{id}")
    public CidadaoResponse buscar(@PathVariable Long id) {
        return mapper.map(buscarOuFalhar(id), CidadaoResponse.class);
    }

    @PutMapping("/{id}")
    public CidadaoResponse atualizar(@PathVariable Long id, @Valid @RequestBody CidadaoRequest request) {
        Cidadao atual = buscarOuFalhar(id);
        request.setNome(request.getNome().trim());
        request.setEmail(request.getEmail().trim());
        if (cidadaoDao.existeEmail(request.getEmail(), id)) {
            throw new RegraNegocioException("Já existe outro cidadão com o e-mail " + request.getEmail() + ".");
        }
        atual.setNome(request.getNome());
        atual.setEmail(request.getEmail());
        cidadaoDao.atualizar(atual);
        return mapper.map(atual, CidadaoResponse.class);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        buscarOuFalhar(id);
        if (cidadaoDao.possuiVinculos(id)) {
            throw new RegraNegocioException("O cidadão possui chamados ou apoios e não pode ser removido.");
        }
        cidadaoDao.remover(id);
        return ResponseEntity.noContent().build();
    }

    private Cidadao buscarOuFalhar(Long id) {
        return cidadaoDao.buscarPorId(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cidadão", id));
    }
}
