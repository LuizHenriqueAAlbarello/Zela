package br.com.fiap.zela.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** Rota simples para o Render (e o professor) verificarem que a API está no ar. Não toca o banco. */
@RestController
public class HealthController {

    @GetMapping({"/", "/health"})
    public Map<String, String> status() {
        return Map.of(
                "api", "Zela - Zeladoria Colaborativa",
                "status", "online",
                "documentacao", "Veja o README.md para a lista de endpoints");
    }
}
