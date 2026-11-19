package br.com.fiap.zela.handler;

import br.com.fiap.zela.dto.ErroResponse;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ErroPadraoController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<ErroResponse> erro(HttpServletRequest req) {
        Object codigo = req.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        HttpStatus status = codigo instanceof Integer valor ? HttpStatus.resolve(valor) : null;
        if (status == null) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        Object uri = req.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        String caminho = uri != null ? uri.toString() : req.getRequestURI();

        String mensagem;
        if (status == HttpStatus.NOT_FOUND) {
            mensagem = "Rota não encontrada.";
        } else if (status.is4xxClientError()) {
            mensagem = "Requisição inválida.";
        } else {
            mensagem = "Erro interno inesperado.";
        }

        ErroResponse corpo = new ErroResponse(status.value(), status.getReasonPhrase(), mensagem, caminho, null);
        return ResponseEntity.status(status).contentType(MediaType.APPLICATION_JSON).body(corpo);
    }
}
