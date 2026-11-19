package br.com.fiap.zela.dao;

import br.com.fiap.zela.model.Chamado;
import br.com.fiap.zela.model.StatusChamado;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ChamadoDao extends BaseDao {

    private static final String SEQUENCE = "sq_tb_zela_chamado";
    private static final String COLUNAS = "cd_chamado, nr_protocolo, cd_categoria, cd_cidadao, ds_chamado, ds_endereco, "
            + "nm_bairro, nr_latitude, nr_longitude, st_chamado, nr_prioridade, dt_abertura, dt_prazo_previsto, nr_nota";

    public ChamadoDao(DataSource dataSource) {
        super(dataSource);
    }

    public Chamado inserir(Chamado c) {
        Connection con = abrirConexao();
        try {
            Long id = proximoId(con, SEQUENCE);
            String protocolo = String.format("ZELA-%d-%06d", c.getDataAbertura().getYear(), id);
            String sql = "INSERT INTO tb_zela_chamado (" + COLUNAS + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setLong(1, id);
                ps.setString(2, protocolo);
                ps.setLong(3, c.getCategoriaId());
                ps.setLong(4, c.getCidadaoId());
                ps.setString(5, c.getDescricao());
                ps.setString(6, c.getEndereco());
                ps.setString(7, c.getBairro());
                ps.setBigDecimal(8, c.getLatitude());
                ps.setBigDecimal(9, c.getLongitude());
                ps.setString(10, c.getStatus().name());
                ps.setInt(11, c.getPrioridade());
                ps.setTimestamp(12, paraTimestamp(c.getDataAbertura()));
                ps.setDate(13, Date.valueOf(c.getPrazoPrevisto()));
                if (c.getNota() == null) {
                    ps.setNull(14, Types.INTEGER);
                } else {
                    ps.setInt(14, c.getNota());
                }
                ps.executeUpdate();
            }
            c.setId(id);
            c.setProtocolo(protocolo);
            return c;
        } catch (SQLException e) {
            throw traduzir("cadastrar chamado", e);
        } finally {
            fecharConexao(con);
        }
    }

    public List<Chamado> listar(String bairro, Long categoriaId, StatusChamado status) {
        StringBuilder sql = new StringBuilder("SELECT " + COLUNAS + " FROM tb_zela_chamado WHERE 1 = 1");
        List<Object> parametros = new ArrayList<>();
        if (bairro != null && !bairro.isBlank()) {
            sql.append(" AND UPPER(nm_bairro) = UPPER(?)");
            parametros.add(bairro.trim());
        }
        if (categoriaId != null) {
            sql.append(" AND cd_categoria = ?");
            parametros.add(categoriaId);
        }
        if (status != null) {
            sql.append(" AND st_chamado = ?");
            parametros.add(status.name());
        }
        sql.append(" ORDER BY nr_prioridade DESC, dt_abertura ASC, cd_chamado ASC");

        Connection con = abrirConexao();
        try (PreparedStatement ps = con.prepareStatement(sql.toString())) {
            for (int i = 0; i < parametros.size(); i++) {
                Object p = parametros.get(i);
                if (p instanceof Long) {
                    ps.setLong(i + 1, (Long) p);
                } else {
                    ps.setString(i + 1, (String) p);
                }
            }
            try (ResultSet rs = ps.executeQuery()) {
                List<Chamado> lista = new ArrayList<>();
                while (rs.next()) {
                    lista.add(mapear(rs));
                }
                return lista;
            }
        } catch (SQLException e) {
            throw traduzir("listar chamados", e);
        } finally {
            fecharConexao(con);
        }
    }

    public Optional<Chamado> buscarPorId(Long id) {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_chamado WHERE cd_chamado = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapear(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw traduzir("buscar chamado", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean atualizar(Chamado c) {
        Connection con = abrirConexao();
        String sql = "UPDATE tb_zela_chamado SET cd_categoria = ?, cd_cidadao = ?, ds_chamado = ?, ds_endereco = ?, "
                + "nm_bairro = ?, nr_latitude = ?, nr_longitude = ?, nr_prioridade = ?, dt_prazo_previsto = ?, nr_nota = ? "
                + "WHERE cd_chamado = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, c.getCategoriaId());
            ps.setLong(2, c.getCidadaoId());
            ps.setString(3, c.getDescricao());
            ps.setString(4, c.getEndereco());
            ps.setString(5, c.getBairro());
            ps.setBigDecimal(6, c.getLatitude());
            ps.setBigDecimal(7, c.getLongitude());
            ps.setInt(8, c.getPrioridade());
            ps.setDate(9, Date.valueOf(c.getPrazoPrevisto()));
            if (c.getNota() == null) {
                ps.setNull(10, Types.INTEGER);
            } else {
                ps.setInt(10, c.getNota());
            }
            ps.setLong(11, c.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("atualizar chamado", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean atualizarStatus(Long id, StatusChamado status) {
        Connection con = abrirConexao();
        String sql = "UPDATE tb_zela_chamado SET st_chamado = ? WHERE cd_chamado = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, status.name());
            ps.setLong(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("atualizar status do chamado", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean atualizarPrioridade(Long id, int prioridade) {
        Connection con = abrirConexao();
        String sql = "UPDATE tb_zela_chamado SET nr_prioridade = ? WHERE cd_chamado = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, prioridade);
            ps.setLong(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("atualizar prioridade do chamado", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean remover(Long id) {
        Connection con = abrirConexao();
        String sql = "DELETE FROM tb_zela_chamado WHERE cd_chamado = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("remover chamado", e);
        } finally {
            fecharConexao(con);
        }
    }

    public Optional<Long> buscarAbertoDuplicado(Long categoriaId, String endereco, Long ignorarId) {
        Connection con = abrirConexao();
        String sql = "SELECT cd_chamado FROM tb_zela_chamado "
                + "WHERE cd_categoria = ? AND UPPER(TRIM(ds_endereco)) = UPPER(TRIM(?)) "
                + "AND st_chamado IN ('ABERTO', 'EM_ANALISE', 'EM_EXECUCAO') AND cd_chamado <> ? "
                + "ORDER BY cd_chamado FETCH FIRST 1 ROWS ONLY";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, categoriaId);
            ps.setString(2, endereco);
            ps.setLong(3, ignorarId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(rs.getLong(1)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw traduzir("verificar chamado duplicado", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean possuiFilhos(Long id) {
        Connection con = abrirConexao();
        String sql = "SELECT (SELECT COUNT(*) FROM tb_zela_atualizacao WHERE cd_chamado = ?) "
                + "+ (SELECT COUNT(*) FROM tb_zela_apoio WHERE cd_chamado = ?) FROM dual";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.setLong(2, id);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            throw traduzir("verificar dependentes do chamado", e);
        } finally {
            fecharConexao(con);
        }
    }

    private Chamado mapear(ResultSet rs) throws SQLException {
        Chamado c = new Chamado();
        c.setId(rs.getLong("cd_chamado"));
        c.setProtocolo(rs.getString("nr_protocolo"));
        c.setCategoriaId(rs.getLong("cd_categoria"));
        c.setCidadaoId(rs.getLong("cd_cidadao"));
        c.setDescricao(rs.getString("ds_chamado"));
        c.setEndereco(rs.getString("ds_endereco"));
        c.setBairro(rs.getString("nm_bairro"));
        c.setLatitude(rs.getBigDecimal("nr_latitude"));
        c.setLongitude(rs.getBigDecimal("nr_longitude"));
        c.setStatus(StatusChamado.valueOf(rs.getString("st_chamado")));
        c.setPrioridade(rs.getInt("nr_prioridade"));
        Timestamp abertura = rs.getTimestamp("dt_abertura");
        c.setDataAbertura(paraLocalDateTime(abertura));
        Date prazo = rs.getDate("dt_prazo_previsto");
        c.setPrazoPrevisto(prazo == null ? null : prazo.toLocalDate());
        int nota = rs.getInt("nr_nota");
        c.setNota(rs.wasNull() ? null : nota);
        return c;
    }
}
