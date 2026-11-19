package br.com.fiap.zela.controller;

import br.com.fiap.zela.config.FusoHorario;
import br.com.fiap.zela.dao.ApoioDao;
import br.com.fiap.zela.dao.CategoriaDao;
import br.com.fiap.zela.dao.ChamadoDao;
import br.com.fiap.zela.dao.CidadaoDao;
import br.com.fiap.zela.dto.ApoioComentarioRequest;
import br.com.fiap.zela.dto.ApoioRequest;
import br.com.fiap.zela.dto.ApoioResponse;
import br.com.fiap.zela.exception.RecursoNaoEncontradoException;
import br.com.fiap.zela.exception.RegraNegocioException;
import br.com.fiap.zela.exception.RequisicaoInvalidaException;
import br.com.fiap.zela.model.Apoio;
import br.com.fiap.zela.model.Categoria;
import br.com.fiap.zela.model.Chamado;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * Apoios ("eu também vi isso"): evitam chamados duplicados e elevam a prioridade.
 * Rotas aninhadas: /chamados/{id}/apoios. Rotas planas: /apoios.
 * Aqui moram RN03 (não apoiar o próprio chamado nem apoiar duas vezes) e RN04 (prioridade sobe a cada 5 apoios).
 */
@RestController
public class ApoioController {

    private final ApoioDao apoioDao;
    private final ChamadoDao chamadoDao;
    private final CidadaoDao cidadaoDao;
    private final CategoriaDao categoriaDao;
    private final ModelMapper mapper;

    public ApoioController(ApoioDao apoioDao, ChamadoDao chamadoDao, CidadaoDao cidadaoDao,
                           CategoriaDao categoriaDao, ModelMapper mapper) {
        this.apoioDao = apoioDao;
        this.chamadoDao = chamadoDao;
        this.cidadaoDao = cidadaoDao;
        this.categoriaDao = categoriaDao;
        this.mapper = mapper;
    }

    // ---------- rotas aninhadas ----------

    @GetMapping("/chamados/{chamadoId}/apoios")
    public List<ApoioResponse> listarDoChamado(@PathVariable Long chamadoId) {
        chamadoOuNaoEncontrado(chamadoId);
        return apoioDao.listarPorChamado(chamadoId).stream()
                .map(a -> mapper.map(a, ApoioResponse.class))
                .toList();
    }

    @PostMapping("/chamados/{chamadoId}/apoios")
    @Transactional
    public ResponseEntity<ApoioResponse> apoiarChamado(@PathVariable Long chamadoId,
                                                       @Valid @RequestBody ApoioRequest request) {
        Chamado chamado = chamadoOuNaoEncontrado(chamadoId);
        return registrar(chamado, request);
    }

    // ---------- CRUD plano ----------

    @PostMapping("/apoios")
    @Transactional
    public ResponseEntity<ApoioResponse> cadastrar(@Valid @RequestBody ApoioRequest request) {
        if (request.getChamadoId() == null) {
            throw new RequisicaoInvalidaException("O campo chamadoId é obrigatório nesta rota.");
        }
        Chamado chamado = chamadoDao.buscarPorId(request.getChamadoId())
                .orElseThrow(() -> new RequisicaoInvalidaException("Chamado " + request.getChamadoId() + " não encontrado."));
        return registrar(chamado, request);
    }

    @GetMapping("/apoios")
    public List<ApoioResponse> listar() {
        return apoioDao.listar().stream()
                .map(a -> mapper.map(a, ApoioResponse.class))
                .toList();
    }

    @GetMapping("/apoios/{id}")
    public ApoioResponse buscar(@PathVariable Long id) {
        return mapper.map(buscarOuFalhar(id), ApoioResponse.class);
    }

    /** Só o comentário pode ser alterado: trocar chamado ou cidadão seria outro apoio. */
    @PutMapping("/apoios/{id}")
    public ApoioResponse atualizar(@PathVariable Long id, @Valid @RequestBody ApoioComentarioRequest request) {
        Apoio atual = buscarOuFalhar(id);
        atual.setComentario(request.getComentario());
        apoioDao.atualizar(atual);
        return mapper.map(atual, ApoioResponse.class);
    }

    @DeleteMapping("/apoios/{id}")
    @Transactional
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        Apoio apoio = buscarOuFalhar(id);
        apoioDao.remover(id);
        chamadoDao.buscarPorId(apoio.getChamadoId()).ifPresent(this::recalcularPrioridade);   // RN04 também ao retirar apoio
        return ResponseEntity.noContent().build();
    }

    // ---------- regras de negócio ----------

    private ResponseEntity<ApoioResponse> registrar(Chamado chamado, ApoioRequest request) {
        // Chamado RESOLVIDO ou CANCELADO não recebe apoio (mesma lógica da RN02): não há mais demanda a medir
        if (chamado.encerrado()) {
            throw new RegraNegocioException("O chamado " + chamado.getProtocolo() + " está "
                    + chamado.getStatus() + " e não recebe novos apoios.");
        }

        cidadaoDao.buscarPorId(request.getCidadaoId())
                .orElseThrow(() -> new RequisicaoInvalidaException("Cidadão " + request.getCidadaoId() + " não encontrado."));

        // RN03a: o cidadão não pode apoiar o próprio chamado
        if (chamado.foiAbertoPor(request.getCidadaoId())) {
            throw new RegraNegocioException("O cidadão não pode apoiar o próprio chamado.");
        }
        // RN03b: nem apoiar o mesmo chamado duas vezes
        if (apoioDao.existe(chamado.getId(), request.getCidadaoId())) {
            throw new RegraNegocioException("Este cidadão já apoiou o chamado " + chamado.getProtocolo() + ".");
        }

        Apoio novo = new Apoio();
        novo.setChamadoId(chamado.getId());
        novo.setCidadaoId(request.getCidadaoId());
        novo.setComentario(request.getComentario());
        novo.setDataApoio(FusoHorario.agora());
        Apoio salvo = apoioDao.inserir(novo);

        recalcularPrioridade(chamado);   // RN04

        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/apoios/{id}").buildAndExpand(salvo.getId()).toUri();
        return ResponseEntity.created(location).body(mapper.map(salvo, ApoioResponse.class));
    }

    /** RN04: prioridade = peso da categoria + 1 a cada 5 apoios, no máximo 5. */
    private void recalcularPrioridade(Chamado chamado) {
        Categoria categoria = categoriaDao.buscarPorId(chamado.getCategoriaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria", chamado.getCategoriaId()));
        int total = apoioDao.contarPorChamado(chamado.getId());
        chamadoDao.atualizarPrioridade(chamado.getId(), Chamado.calcularPrioridade(categoria.getPeso(), total));
    }

    private Chamado chamadoOuNaoEncontrado(Long id) {
        return chamadoDao.buscarPorId(id).orElseThrow(() -> new RecursoNaoEncontradoException("Chamado", id));
    }

    private Apoio buscarOuFalhar(Long id) {
        return apoioDao.buscarPorId(id).orElseThrow(() -> new RecursoNaoEncontradoException("Apoio", id));
    }
}
