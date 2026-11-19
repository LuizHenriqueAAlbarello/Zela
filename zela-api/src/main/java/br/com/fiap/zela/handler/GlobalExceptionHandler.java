package br.com.fiap.zela.handler;

import br.com.fiap.zela.dto.CampoInvalido;
import br.com.fiap.zela.dto.ErroResponse;
import br.com.fiap.zela.exception.ErroPersistenciaException;
import br.com.fiap.zela.exception.RecursoNaoEncontradoException;
import br.com.fiap.zela.exception.RegraNegocioException;
import br.com.fiap.zela.exception.RequisicaoInvalidaException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;
import java.util.Set;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> validacao(MethodArgumentNotValidException ex, HttpServletRequest req) {
        List<CampoInvalido> campos = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> new CampoInvalido(e.getField(), e.getDefaultMessage()))
                .toList();
        return resposta(HttpStatus.BAD_REQUEST, "Dados inválidos. Corrija os campos indicados.", req, campos);
    }

    @ExceptionHandler(RequisicaoInvalidaException.class)
    public ResponseEntity<ErroResponse> requisicaoInvalida(RequisicaoInvalidaException ex, HttpServletRequest req) {
        return resposta(HttpStatus.BAD_REQUEST, ex.getMessage(), req, null);
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MissingServletRequestParameterException.class})
    public ResponseEntity<ErroResponse> corpoIlegivel(Exception ex, HttpServletRequest req) {
        return resposta(HttpStatus.BAD_REQUEST, "Requisição malformada: confira o JSON e os parâmetros enviados.", req, null);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErroResponse> tipoInvalido(MethodArgumentTypeMismatchException ex, HttpServletRequest req) {
        return resposta(HttpStatus.BAD_REQUEST, "Valor inválido para o parâmetro '" + ex.getName() + "'.", req, null);
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> naoEncontrado(RecursoNaoEncontradoException ex, HttpServletRequest req) {
        return resposta(HttpStatus.NOT_FOUND, ex.getMessage(), req, null);
    }

    @ExceptionHandler({NoResourceFoundException.class, NoHandlerFoundException.class})
    public ResponseEntity<ErroResponse> rotaInexistente(Exception ex, HttpServletRequest req) {
        return resposta(HttpStatus.NOT_FOUND, "Rota não encontrada.", req, null);
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResponse> conflito(RegraNegocioException ex, HttpServletRequest req) {
        return resposta(HttpStatus.CONFLICT, ex.getMessage(), req, null);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErroResponse> metodoNaoSuportado(HttpRequestMethodNotSupportedException ex, HttpServletRequest req) {
        ResponseEntity<ErroResponse> base = resposta(HttpStatus.METHOD_NOT_ALLOWED,
                "Método " + ex.getMethod() + " não é suportado nesta rota.", req, null);
        Set<HttpMethod> permitidos = ex.getSupportedHttpMethods();
        if (permitidos == null || permitidos.isEmpty()) {
            return base;
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setAllow(permitidos);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .headers(headers)
                .contentType(MediaType.APPLICATION_JSON)
                .body(base.getBody());
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErroResponse> midiaNaoSuportada(HttpMediaTypeNotSupportedException ex, HttpServletRequest req) {
        return resposta(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Envie o corpo como application/json.", req, null);
    }

    @ExceptionHandler(ErroPersistenciaException.class)
    public ResponseEntity<ErroResponse> persistencia(ErroPersistenciaException ex, HttpServletRequest req) {
        log.error("Falha de persistência em {} {}", req.getMethod(), req.getRequestURI(), ex);
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno ao acessar os dados. Tente novamente.", req, null);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErroResponse> acessoDados(DataAccessException ex, HttpServletRequest req) {
        log.error("Falha de acesso ao banco em {} {}", req.getMethod(), req.getRequestURI(), ex);
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno ao acessar os dados. Tente novamente.", req, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> inesperado(Exception ex, HttpServletRequest req) {
        if (ex instanceof ErrorResponse erroSpring) {
            HttpStatus status = HttpStatus.resolve(erroSpring.getStatusCode().value());
            if (status != null && status.is4xxClientError()) {
                log.warn("Requisição recusada em {} {}: {}", req.getMethod(), req.getRequestURI(), status);
                return resposta(status, "Requisição inválida.", req, null);
            }
        }
        log.error("Erro inesperado em {} {}", req.getMethod(), req.getRequestURI(), ex);
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno inesperado.", req, null);
    }

    private ResponseEntity<ErroResponse> resposta(HttpStatus status, String mensagem,
                                                  HttpServletRequest req, List<CampoInvalido> campos) {
        ErroResponse corpo = new ErroResponse(status.value(), status.getReasonPhrase(), mensagem,
                req.getRequestURI(), campos);
        return ResponseEntity.status(status).contentType(MediaType.APPLICATION_JSON).body(corpo);
    }
}
