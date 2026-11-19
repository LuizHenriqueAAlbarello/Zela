package br.com.fiap.zela.config;

import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * Fuso único da API. O Render roda em UTC; datas de chamados, históricos, apoios
 * e erros saem todas no horário de Brasília para o front e o professor verem o mesmo relógio.
 */
public final class FusoHorario {

    public static final ZoneId ZONA = ZoneId.of("America/Sao_Paulo");

    private FusoHorario() {
    }

    public static LocalDateTime agora() {
        return LocalDateTime.now(ZONA);
    }
}
