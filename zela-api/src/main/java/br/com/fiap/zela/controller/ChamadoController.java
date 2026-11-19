package br.com.fiap.zela.controller;

import br.com.fiap.zela.config.FusoHorario;
import br.com.fiap.zela.dao.ApoioDao;
import br.com.fiap.zela.dao.CategoriaDao;
import br.com.fiap.zela.dao.ChamadoDao;
import br.com.fiap.zela.dao.CidadaoDao;
import br.com.fiap.zela.dto.ChamadoRequest;
import br.com.fiap.zela.dto.ChamadoResponse;
import br.com.fiap.zela.exception.RecursoNaoEncontradoException;
import br.com.fiap.zela.exception.RegraNegocioException;
import br.com.fiap.zela.exception.RequisicaoInvalidaException;
import br.com.fiap.zela.model.Categoria;
import br.com.fiap.zela.model.Chamado;
import br.com.fiap.zela.model.StatusChamado;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/chamados")
public class ChamadoController {

    private final ChamadoDao chamadoDao;
    private final CategoriaDao categoriaDao;
    private final CidadaoDao cidadaoDao;
    private final ApoioDao apoioDao;
    private final ModelMapper mapper;

    public ChamadoController(ChamadoDao chamadoDao, CategoriaDao categoriaDao, CidadaoDao cidadaoDao,
                             ApoioDao apoioDao, ModelMapper mapper) {
        this.chamadoDao = chamadoDao;
        this.categoriaDao = categoriaDao;
        this.cidadaoDao = cidadaoDao;
        this.apoioDao = apoioDao;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<ChamadoResponse> cadastrar(@Valid @RequestBody ChamadoRequest request) {
        validarCoordenadas(request);
        Categoria categoria = categoriaDaRequisicao(request.getCategoriaId());
        cidadaoDao.buscarPorId(request.getCidadaoId())
                .orElseThrow(() -> new RequisicaoInvalidaException("Cidadão " + request.getCidadaoId() + " não encontrado."));

        validarDuplicidade(request.getCategoriaId(), request.getEndereco(), 0L);   // RN01
        if (request.getNota() != null) {                                           // RN05: chamado novo é ABERTO
            throw new RegraNegocioException("A nota só pode ser registrada quando o chamado estiver RESOLVIDO.");
        }

        Chamado novo = mapper.map(request, Chamado.class);
        novo.setId(null);
        novo.setDescricao(request.getDescricao().trim());
        novo.setEndereco(request.getEndereco().trim());
        novo.setBairro(request.getBairro().trim());
        novo.setStatus(StatusChamado.ABERTO);
        novo.setPrioridade(Chamado.calcularPrioridade(categoria.getPeso(), 0));   // RN04: começa no peso da categoria
        novo.setDataAbertura(FusoHorario.agora());
        novo.setPrazoPrevisto(novo.getDataAbertura().toLocalDate().plusDays(categoria.getPrazoDias()));

        Chamado salvo = chamadoDao.inserir(novo);
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/chamados/{id}").buildAndExpand(salvo.getId()).toUri();
        return ResponseEntity.created(location).body(paraResposta(salvo));
    }

    @GetMapping
    public List<ChamadoResponse> listar(@RequestParam(required = false) String bairro,
                                        @RequestParam(required = false) Long categoriaId,
                                        @RequestParam(required = false) String status) {
        StatusChamado filtro = null;
        if (status != null && !status.isBlank()) {
            try {
                filtro = StatusChamado.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RequisicaoInvalidaException(
                        "Status inválido. Use ABERTO, EM_ANALISE, EM_EXECUCAO, RESOLVIDO ou CANCELADO.");
            }
        }
        return chamadoDao.listar(bairro, categoriaId, filtro).stream()
                .map(this::paraResposta)
                .toList();
    }

    @GetMapping("/{id}")
    public ChamadoResponse buscar(@PathVariable Long id) {
        return paraResposta(buscarOuFalhar(id));
    }

    @PutMapping("/{id}")
    @Transactional
    public ChamadoResponse atualizar(@PathVariable Long id, @Valid @RequestBody ChamadoRequest request) {
        Chamado atual = buscarOuFalhar(id);

        // O autor é quem abriu o chamado: trocá-lo apagaria a origem do pedido e burlaria a RN03
        if (!atual.foiAbertoPor(request.getCidadaoId())) {
            throw new RegraNegocioException("O autor do chamado não pode ser alterado. Envie cidadaoId = "
                    + atual.getCidadaoId() + ".");
        }

        // Chamado encerrado: CANCELADO não muda mais; RESOLVIDO só recebe a nota de avaliação (RN05)
        if (atual.encerrado()) {
            if (atual.getStatus() == StatusChamado.CANCELADO || request.getNota() == null) {
                throw new RegraNegocioException("O chamado " + atual.getProtocolo() + " está " + atual.getStatus()
                        + " e não pode ser editado. Um chamado RESOLVIDO só recebe a nota de avaliação.");
            }
            if (alteraDados(atual, request)) {
                throw new RegraNegocioException("O chamado " + atual.getProtocolo() + " está RESOLVIDO: só a nota "
                        + "pode ser enviada. Repita os demais campos exatamente como estão.");
            }
            atual.setNota(request.getNota());
            chamadoDao.atualizar(atual);
            return paraResposta(atual);
        }

        if (request.getNota() != null && !atual.aceitaAvaliacao()) {               // RN05
            throw new RegraNegocioException("A nota só pode ser registrada quando o chamado estiver RESOLVIDO.");
        }
        validarCoordenadas(request);
        Categoria categoria = categoriaDaRequisicao(request.getCategoriaId());
        validarDuplicidade(request.getCategoriaId(), request.getEndereco(), id);   // RN01 (ignora o próprio chamado)

        atual.setCategoriaId(request.getCategoriaId());
        atual.setDescricao(request.getDescricao().trim());
        atual.setEndereco(request.getEndereco().trim());
        atual.setBairro(request.getBairro().trim());
        atual.setLatitude(request.getLatitude());
        atual.setLongitude(request.getLongitude());
        atual.setPrioridade(Chamado.calcularPrioridade(categoria.getPeso(), apoioDao.contarPorChamado(id)));
        atual.setPrazoPrevisto(atual.getDataAbertura().toLocalDate().plusDays(categoria.getPrazoDias()));

        chamadoDao.atualizar(atual);
        return paraResposta(atual);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        buscarOuFalhar(id);
        if (chamadoDao.possuiFilhos(id)) {
            throw new RegraNegocioException("O chamado possui atualizações ou apoios e não pode ser removido.");
        }
        chamadoDao.remover(id);
        return ResponseEntity.noContent().build();
    }

    private void validarDuplicidade(Long categoriaId, String endereco, Long ignorarId) {
        chamadoDao.buscarAbertoDuplicado(categoriaId, endereco, ignorarId).ifPresent(existente -> {
            throw new RegraNegocioException("Já existe o chamado em aberto #" + existente
                    + " desta categoria neste endereço. Apoie-o em POST /chamados/" + existente + "/apoios.");
        });
    }

    private boolean alteraDados(Chamado atual, ChamadoRequest request) {
        return !Objects.equals(atual.getCategoriaId(), request.getCategoriaId())
                || !mesmoTexto(atual.getDescricao(), request.getDescricao())
                || !mesmoTexto(atual.getEndereco(), request.getEndereco())
                || !mesmoTexto(atual.getBairro(), request.getBairro())
                || !mesmoNumero(atual.getLatitude(), request.getLatitude())
                || !mesmoNumero(atual.getLongitude(), request.getLongitude());
    }

    private static boolean mesmoTexto(String atual, String novo) {
        return novo != null && atual != null && atual.trim().equals(novo.trim());
    }

    private static boolean mesmoNumero(BigDecimal atual, BigDecimal novo) {
        if (atual == null || novo == null) {
            return atual == null && novo == null;
        }
        return atual.compareTo(novo) == 0;
    }

    private void validarCoordenadas(ChamadoRequest request) {
        if ((request.getLatitude() == null) != (request.getLongitude() == null)) {
            throw new RequisicaoInvalidaException("Informe latitude e longitude juntas, ou nenhuma das duas.");
        }
    }

    private Categoria categoriaDaRequisicao(Long categoriaId) {
        return categoriaDao.buscarPorId(categoriaId)
                .orElseThrow(() -> new RequisicaoInvalidaException("Categoria " + categoriaId + " não encontrada."));
    }

    private ChamadoResponse paraResposta(Chamado chamado) {
        ChamadoResponse resposta = mapper.map(chamado, ChamadoResponse.class);
        resposta.setApoios(apoioDao.contarPorChamado(chamado.getId()));
        return resposta;
    }

    private Chamado buscarOuFalhar(Long id) {
        return chamadoDao.buscarPorId(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Chamado", id));
    }
}
