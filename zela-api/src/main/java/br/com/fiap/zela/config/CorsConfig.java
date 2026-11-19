package br.com.fiap.zela.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

/**
 * Libera o CORS para o front-end do grupo chamar a API (local ou publicado).
 * CORS_ORIGINS aceita uma lista separada por vírgula. Ausente ou vazia: libera todas as origens.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final String[] origens;

    public CorsConfig(@Value("${zela.cors.allowed-origins:*}") String origens) {
        this.origens = interpretar(origens);
    }

    /** Remove espaços e itens vazios. Se nada sobrar, libera todas as origens ("*"). */
    static String[] interpretar(String valor) {
        if (valor == null) {
            return new String[]{"*"};
        }
        String[] lista = Arrays.stream(valor.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toArray(String[]::new);
        return lista.length == 0 ? new String[]{"*"} : lista;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(origens)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Location")
                .maxAge(3600);
    }
}
