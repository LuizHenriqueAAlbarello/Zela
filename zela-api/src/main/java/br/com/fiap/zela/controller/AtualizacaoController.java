package br.com.fiap.zela.controller;

import br.com.fiap.zela.config.FusoHorario;
import br.com.fiap.zela.dao.AtualizacaoDao;
import br.com.fiap.zela.dao.ChamadoDao;
import br.com.fiap.zela.dto.AtualizacaoEdicaoRequest;
import br.com.fiap.zela.dto.AtualizacaoRequest;
import br.com.fiap.zela.dto.AtualizacaoResponse;
import br.com.fiap.zela.exception.RecursoNaoEncontradoException;
import br.com.fiap.zela.exception.RegraNegocioException;
import br.com.fiap.zela.exception.RequisicaoInvalidaException;
import br.com.fiap.zela.model.Atualizacao;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
public class AtualizacaoController {

    private final AtualizacaoDao atualizacaoDao;
    private final ChamadoDao chamadoDao;
    private final ModelMapper mapper;

    public AtualizacaoController(AtualizacaoDao atualizacaoDao, ChamadoDao chamadoDao, ModelMapper mapper) {
        this.atualizacaoDao = atualizacaoDao;
        this.chamadoDao = chamadoDao;
        this.mapper = mapper;
    }

    @GetMapping("/chamados/{chamadoId}/atualizacoes")
    public List<AtualizacaoResponse> listarDoChamado(@PathVariable Long chamadoId) {
        chamadoOuNaoEncontrado(chamadoId);
        return atualizacaoDao.listarPorChamado(chamadoId).stream()
                .map(a -> mapper.map(a, AtualizacaoResponse.class))
                .toList();
    }

    @PostMapping("/chamados/{chamadoId}/atualizacoes")
    @Transactional
    public ResponseEntity<AtualizacaoResponse> cadastrarNoChamado(@PathVariable Long chamadoId,
                                                                  @Valid @RequestBody AtualizacaoRequest request) {
        Chamado chamado = chamadoOuNaoEncontrado(chamadoId);
        return registrar(chamado, request);
    }

    @PostMapping("/atualizacoes")
    @Transactional
    public ResponseEntity<AtualizacaoResponse> cadastrar(@Valid @RequestBody AtualizacaoRequest request) {
        if (request.getChamadoId() == null) {
            throw new RequisicaoInvalidaException("O campo chamadoId é obrigatório nesta rota.");
        }
        Chamado chamado = chamadoDao.buscarPorId(request.getChamadoId())
                .orElseThrow(() -> new RequisicaoInvalidaException("Chamado " + request.getChamadoId() + " não encontrado."));
        return registrar(chamado, request);
    }

    @GetMapping("/atualizacoes")
    public List<AtualizacaoResponse> listar() {
        return atualizacaoDao.listar().stream()
                .map(a -> mapper.map(a, AtualizacaoResponse.class))
                .toList();
    }

    @GetMapping("/atualizacoes/{id}")
    public AtualizacaoResponse buscar(@PathVariable Long id) {
        return mapper.map(buscarOuFalhar(id), AtualizacaoResponse.class);
    }

    @PutMapping("/atualizacoes/{id}")
    public AtualizacaoResponse atualizar(@PathVariable Long id, @Valid @RequestBody AtualizacaoEdicaoRequest request) {
        Atualizacao atual = buscarOuFalhar(id);
        atual.setMensagem(request.getMensagem().trim());
        atual.setAutor(request.getAutor().trim());
        atualizacaoDao.atualizar(atual);
        return mapper.map(atual, AtualizacaoResponse.class);
    }

    @DeleteMapping("/atualizacoes/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        Atualizacao atual = buscarOuFalhar(id);
        if (atual.getNovoStatus() != null) {
            throw new RegraNegocioException("Esta atualização registrou a mudança para " + atual.getNovoStatus()
                    + " e faz parte do histórico do chamado. Ela não pode ser removida.");
        }
        atualizacaoDao.remover(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<AtualizacaoResponse> registrar(Chamado chamado, AtualizacaoRequest request) {
        // RN02: chamado RESOLVIDO ou CANCELADO não recebe novas atualizações
        if (chamado.encerrado()) {
            throw new RegraNegocioException("O chamado " + chamado.getProtocolo() + " está "
                    + chamado.getStatus() + " e não recebe novas atualizações.");
        }

        StatusChamado novoStatus = request.getNovoStatus() == null ? null : StatusChamado.valueOf(request.getNovoStatus());
        if (novoStatus != null && !chamado.getStatus().podeIrPara(novoStatus)) {
            throw new RegraNegocioException("Transição inválida: de " + chamado.getStatus() + " para " + novoStatus
                    + ". Fluxo: ABERTO > EM_ANALISE > EM_EXECUCAO > RESOLVIDO (CANCELADO a partir de ABERTO ou EM_ANALISE).");
        }

        Atualizacao nova = new Atualizacao();
        nova.setChamadoId(chamado.getId());
        nova.setMensagem(request.getMensagem().trim());
        nova.setAutor(request.getAutor().trim());
        nova.setNovoStatus(novoStatus);
        nova.setDataAtualizacao(FusoHorario.agora());

        Atualizacao salva = atualizacaoDao.inserir(nova);
        if (novoStatus != null) {
            chamadoDao.atualizarStatus(chamado.getId(), novoStatus);
        }

        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/atualizacoes/{id}").buildAndExpand(salva.getId()).toUri();
        return ResponseEntity.created(location).body(mapper.map(salva, AtualizacaoResponse.class));
    }

    private Chamado chamadoOuNaoEncontrado(Long id) {
        return chamadoDao.buscarPorId(id).orElseThrow(() -> new RecursoNaoEncontradoException("Chamado", id));
    }

    private Atualizacao buscarOuFalhar(Long id) {
        return atualizacaoDao.buscarPorId(id).orElseThrow(() -> new RecursoNaoEncontradoException("Atualização", id));
    }
}
