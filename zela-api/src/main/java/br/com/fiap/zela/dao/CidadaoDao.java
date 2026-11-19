package br.com.fiap.zela.dao;

import br.com.fiap.zela.model.Cidadao;
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
public class CidadaoDao extends BaseDao {

    private static final String SEQUENCE = "sq_tb_zela_cidadao";
    private static final String COLUNAS = "cd_cidadao, nm_cidadao, ds_email";

    public CidadaoDao(DataSource dataSource) {
        super(dataSource);
    }

    public Cidadao inserir(Cidadao c) {
        Connection con = abrirConexao();
        try {
            Long id = proximoId(con, SEQUENCE);
            String sql = "INSERT INTO tb_zela_cidadao (" + COLUNAS + ") VALUES (?, ?, ?)";
            try (PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setLong(1, id);
                ps.setString(2, c.getNome());
                ps.setString(3, c.getEmail());
                ps.executeUpdate();
            }
            c.setId(id);
            return c;
        } catch (SQLException e) {
            throw traduzir("cadastrar cidadão", e);
        } finally {
            fecharConexao(con);
        }
    }

    public List<Cidadao> listar() {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_cidadao ORDER BY nm_cidadao";
        try (PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            List<Cidadao> lista = new ArrayList<>();
            while (rs.next()) {
                lista.add(mapear(rs));
            }
            return lista;
        } catch (SQLException e) {
            throw traduzir("listar cidadãos", e);
        } finally {
            fecharConexao(con);
        }
    }

    public Optional<Cidadao> buscarPorId(Long id) {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_cidadao WHERE cd_cidadao = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapear(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw traduzir("buscar cidadão", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean atualizar(Cidadao c) {
        Connection con = abrirConexao();
        String sql = "UPDATE tb_zela_cidadao SET nm_cidadao = ?, ds_email = ? WHERE cd_cidadao = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, c.getNome());
            ps.setString(2, c.getEmail());
            ps.setLong(3, c.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("atualizar cidadão", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean remover(Long id) {
        Connection con = abrirConexao();
        String sql = "DELETE FROM tb_zela_cidadao WHERE cd_cidadao = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("remover cidadão", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean existeEmail(String email, Long ignorarId) {
        Connection con = abrirConexao();
        String sql = "SELECT COUNT(*) FROM tb_zela_cidadao WHERE LOWER(ds_email) = LOWER(?) AND cd_cidadao <> ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, email.trim());
            ps.setLong(2, ignorarId);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            throw traduzir("verificar e-mail do cidadão", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean possuiVinculos(Long id) {
        Connection con = abrirConexao();
        String sql = "SELECT (SELECT COUNT(*) FROM tb_zela_chamado WHERE cd_cidadao = ?) "
                + "+ (SELECT COUNT(*) FROM tb_zela_apoio WHERE cd_cidadao = ?) FROM dual";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.setLong(2, id);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            throw traduzir("verificar vínculos do cidadão", e);
        } finally {
            fecharConexao(con);
        }
    }

    private Cidadao mapear(ResultSet rs) throws SQLException {
        Cidadao c = new Cidadao();
        c.setId(rs.getLong("cd_cidadao"));
        c.setNome(rs.getString("nm_cidadao"));
        c.setEmail(rs.getString("ds_email"));
        return c;
    }
}
