package br.com.fiap.zela.dao;

import br.com.fiap.zela.model.Apoio;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ApoioDao extends BaseDao {

    private static final String SEQUENCE = "sq_tb_zela_apoio";
    private static final String COLUNAS = "cd_apoio, cd_chamado, cd_cidadao, ds_comentario, dt_apoio";

    public ApoioDao(DataSource dataSource) {
        super(dataSource);
    }

    public Apoio inserir(Apoio a) {
        Connection con = abrirConexao();
        try {
            Long id = proximoId(con, SEQUENCE);
            String sql = "INSERT INTO tb_zela_apoio (" + COLUNAS + ") VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setLong(1, id);
                ps.setLong(2, a.getChamadoId());
                ps.setLong(3, a.getCidadaoId());
                ps.setString(4, a.getComentario());
                ps.setTimestamp(5, paraTimestamp(a.getDataApoio()));
                ps.executeUpdate();
            }
            a.setId(id);
            return a;
        } catch (SQLException e) {
            throw traduzir("cadastrar apoio", e);
        } finally {
            fecharConexao(con);
        }
    }

    public List<Apoio> listar() {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_apoio ORDER BY dt_apoio DESC, cd_apoio DESC";
        try (PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            List<Apoio> lista = new ArrayList<>();
            while (rs.next()) {
                lista.add(mapear(rs));
            }
            return lista;
        } catch (SQLException e) {
            throw traduzir("listar apoios", e);
        } finally {
            fecharConexao(con);
        }
    }

    public List<Apoio> listarPorChamado(Long chamadoId) {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_apoio WHERE cd_chamado = ? ORDER BY dt_apoio ASC, cd_apoio ASC";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, chamadoId);
            try (ResultSet rs = ps.executeQuery()) {
                List<Apoio> lista = new ArrayList<>();
                while (rs.next()) {
                    lista.add(mapear(rs));
                }
                return lista;
            }
        } catch (SQLException e) {
            throw traduzir("listar apoios do chamado", e);
        } finally {
            fecharConexao(con);
        }
    }

    public Optional<Apoio> buscarPorId(Long id) {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_apoio WHERE cd_apoio = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapear(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw traduzir("buscar apoio", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean atualizar(Apoio a) {
        Connection con = abrirConexao();
        String sql = "UPDATE tb_zela_apoio SET ds_comentario = ? WHERE cd_apoio = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, a.getComentario());
            ps.setLong(2, a.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("atualizar apoio", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean remover(Long id) {
        Connection con = abrirConexao();
        String sql = "DELETE FROM tb_zela_apoio WHERE cd_apoio = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("remover apoio", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean existe(Long chamadoId, Long cidadaoId) {
        Connection con = abrirConexao();
        String sql = "SELECT COUNT(*) FROM tb_zela_apoio WHERE cd_chamado = ? AND cd_cidadao = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, chamadoId);
            ps.setLong(2, cidadaoId);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            throw traduzir("verificar apoio existente", e);
        } finally {
            fecharConexao(con);
        }
    }

    public int contarPorChamado(Long chamadoId) {
        Connection con = abrirConexao();
        String sql = "SELECT COUNT(*) FROM tb_zela_apoio WHERE cd_chamado = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, chamadoId);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            throw traduzir("contar apoios do chamado", e);
        } finally {
            fecharConexao(con);
        }
    }

    private Apoio mapear(ResultSet rs) throws SQLException {
        Apoio a = new Apoio();
        a.setId(rs.getLong("cd_apoio"));
        a.setChamadoId(rs.getLong("cd_chamado"));
        a.setCidadaoId(rs.getLong("cd_cidadao"));
        a.setComentario(rs.getString("ds_comentario"));
        a.setDataApoio(paraLocalDateTime(rs.getTimestamp("dt_apoio")));
        return a;
    }
}
