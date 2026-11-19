package br.com.fiap.zela.config;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

@Component
public class InicializadorBanco implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(InicializadorBanco.class);

    private final DataSource dataSource;

    public InicializadorBanco(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            if (tabelasExistem()) {
                log.info("Banco do Zela encontrado: nenhuma tabela foi criada.");
                return;
            }
            ResourceDatabasePopulator populador = new ResourceDatabasePopulator(
                    new ClassPathResource("db/01_criar_tabelas.sql"),
                    new ClassPathResource("db/02_dados_exemplo.sql"));
            populador.setSqlScriptEncoding("UTF-8");
            populador.setContinueOnError(true);
            populador.execute(dataSource);
            log.info("Tabelas e dados de exemplo do Zela criados no Oracle.");
        } catch (SQLException | DataAccessException e) {
            log.error("Não foi possível preparar o banco do Zela: {}", e.getMessage());
        }
    }

    private boolean tabelasExistem() throws SQLException {
        String sql = "SELECT COUNT(*) FROM user_tables WHERE table_name = 'TB_ZELA_CATEGORIA'";
        try (Connection conexao = dataSource.getConnection();
             PreparedStatement ps = conexao.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            rs.next();
            return rs.getInt(1) > 0;
        }
    }
}
