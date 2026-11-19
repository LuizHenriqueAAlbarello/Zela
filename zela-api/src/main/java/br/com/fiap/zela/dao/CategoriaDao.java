package br.com.fiap.zela.dao;

import br.com.fiap.zela.model.Categoria;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/** Tabela tb_zela_categoria (sequence sq_tb_zela_categoria). */
@Repository
public class CategoriaDao extends BaseDao {

    private static final String SEQUENCE = "sq_tb_zela_categoria";
    private static final String COLUNAS = "cd_categoria, nm_categoria, nr_peso, nr_prazo_dias";

    public CategoriaDao(DataSource dataSource) {
        super(dataSource);
    }

    public Categoria inserir(Categoria c) {
        Connection con = abrirConexao();
        try {
            Long id = proximoId(con, SEQUENCE);
            String sql = "INSERT INTO tb_zela_categoria (" + COLUNAS + ") VALUES (?, ?, ?, ?)";
            try (PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setLong(1, id);
                ps.setString(2, c.getNome());
                ps.setInt(3, c.getPeso());
                ps.setInt(4, c.getPrazoDias());
                ps.executeUpdate();
            }
            c.setId(id);
            return c;
        } catch (SQLException e) {
            throw traduzir("cadastrar categoria", e);
        } finally {
            fecharConexao(con);
        }
    }

    public List<Categoria> listar() {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_categoria ORDER BY nm_categoria";
        try (PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            List<Categoria> lista = new ArrayList<>();
            while (rs.next()) {
                lista.add(mapear(rs));
            }
            return lista;
        } catch (SQLException e) {
            throw traduzir("listar categorias", e);
        } finally {
            fecharConexao(con);
        }
    }

    public Optional<Categoria> buscarPorId(Long id) {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_categoria WHERE cd_categoria = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapear(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw traduzir("buscar categoria", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean atualizar(Categoria c) {
        Connection con = abrirConexao();
        String sql = "UPDATE tb_zela_categoria SET nm_categoria = ?, nr_peso = ?, nr_prazo_dias = ? WHERE cd_categoria = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, c.getNome());
            ps.setInt(2, c.getPeso());
            ps.setInt(3, c.getPrazoDias());
            ps.setLong(4, c.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("atualizar categoria", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean remover(Long id) {
        Connection con = abrirConexao();
        String sql = "DELETE FROM tb_zela_categoria WHERE cd_categoria = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("remover categoria", e);
        } finally {
            fecharConexao(con);
        }
    }

    /** Nome já usado por OUTRA categoria (ignorarId = 0 no cadastro). */
    public boolean existeNome(String nome, Long ignorarId) {
        Connection con = abrirConexao();
        String sql = "SELECT COUNT(*) FROM tb_zela_categoria WHERE UPPER(nm_categoria) = UPPER(?) AND cd_categoria <> ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, nome.trim());
            ps.setLong(2, ignorarId);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            throw traduzir("verificar nome da categoria", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean possuiChamados(Long id) {
        Connection con = abrirConexao();
        String sql = "SELECT COUNT(*) FROM tb_zela_chamado WHERE cd_categoria = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            throw traduzir("verificar chamados da categoria", e);
        } finally {
            fecharConexao(con);
        }
    }

    private Categoria mapear(ResultSet rs) throws SQLException {
        Categoria c = new Categoria();
        c.setId(rs.getLong("cd_categoria"));
        c.setNome(rs.getString("nm_categoria"));
        c.setPeso(rs.getInt("nr_peso"));
        c.setPrazoDias(rs.getInt("nr_prazo_dias"));
        return c;
    }
}
