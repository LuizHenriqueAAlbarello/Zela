package br.com.fiap.zela.dao;

import br.com.fiap.zela.exception.ErroPersistenciaException;
import br.com.fiap.zela.exception.RegraNegocioException;
import br.com.fiap.zela.exception.RequisicaoInvalidaException;
import org.springframework.jdbc.datasource.DataSourceUtils;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

public abstract class BaseDao {

    private static final int ORA_UNIQUE_VIOLADA = 1;
    private static final int ORA_FK_VIOLADA = 2291;
    private static final int ORA_FILHOS_EXISTEM = 2292;
    private static final int ORA_CHECK_VIOLADA = 2290;
    private static final int ORA_NULO_NAO_PERMITIDO = 1400;
    private static final int ORA_VALOR_GRANDE_DEMAIS = 12899;

    protected final DataSource dataSource;

    protected BaseDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    protected Connection abrirConexao() {
        return DataSourceUtils.getConnection(dataSource);
    }

    protected void fecharConexao(Connection conexao) {
        DataSourceUtils.releaseConnection(conexao, dataSource);
    }

    protected Long proximoId(Connection conexao, String sequence) throws SQLException {
        String sql = "SELECT " + sequence + ".NEXTVAL FROM dual";
        try (PreparedStatement ps = conexao.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            rs.next();
            return rs.getLong(1);
        }
    }

    protected RuntimeException traduzir(String operacao, SQLException e) {
        switch (e.getErrorCode()) {
            case ORA_UNIQUE_VIOLADA:
                return new RegraNegocioException("Já existe um registro com esses dados (duplicidade).");
            case ORA_FILHOS_EXISTEM:
                return new RegraNegocioException("O registro possui dependentes e não pode ser removido.");
            case ORA_FK_VIOLADA:
                return new RegraNegocioException("Referência inválida: o registro relacionado não existe.");
            case ORA_CHECK_VIOLADA:
                return new RegraNegocioException("Os dados violam uma regra do domínio garantida pelo banco.");
            case ORA_VALOR_GRANDE_DEMAIS:
                return new RequisicaoInvalidaException("Um dos textos excede o tamanho permitido pelo banco.");
            case ORA_NULO_NAO_PERMITIDO:
                return new RequisicaoInvalidaException("Um campo obrigatório não foi informado.");
            default:
                return new ErroPersistenciaException("Falha ao " + operacao, e);
        }
    }

    protected static Timestamp paraTimestamp(LocalDateTime data) {
        return data == null ? null : Timestamp.valueOf(data);
    }

    protected static LocalDateTime paraLocalDateTime(Timestamp ts) {
        return ts == null ? null : ts.toLocalDateTime();
    }
}
