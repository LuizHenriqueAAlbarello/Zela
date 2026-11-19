package br.com.fiap.zela.config;

import java.time.LocalDateTime;
import java.time.ZoneId;

public final class FusoHorario {

    public static final ZoneId ZONA = ZoneId.of("America/Sao_Paulo");

    private FusoHorario() {
    }

    public static LocalDateTime agora() {
        return LocalDateTime.now(ZONA);
    }
}
