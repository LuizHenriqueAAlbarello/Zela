package br.com.fiap.zela.dao;

import br.com.fiap.zela.model.Atualizacao;
import br.com.fiap.zela.model.StatusChamado;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class AtualizacaoDao extends BaseDao {

    private static final String SEQUENCE = "sq_tb_zela_atualizacao";
    private static final String COLUNAS = "cd_atualizacao, cd_chamado, ds_mensagem, nm_autor, st_novo, dt_atualizacao";

    public AtualizacaoDao(DataSource dataSource) {
        super(dataSource);
    }

    public Atualizacao inserir(Atualizacao a) {
        Connection con = abrirConexao();
        try {
            Long id = proximoId(con, SEQUENCE);
            String sql = "INSERT INTO tb_zela_atualizacao (" + COLUNAS + ") VALUES (?, ?, ?, ?, ?, ?)";
            try (PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setLong(1, id);
                ps.setLong(2, a.getChamadoId());
                ps.setString(3, a.getMensagem());
                ps.setString(4, a.getAutor());
                if (a.getNovoStatus() == null) {
                    ps.setNull(5, Types.VARCHAR);
                } else {
                    ps.setString(5, a.getNovoStatus().name());
                }
                ps.setTimestamp(6, paraTimestamp(a.getDataAtualizacao()));
                ps.executeUpdate();
            }
            a.setId(id);
            return a;
        } catch (SQLException e) {
            throw traduzir("cadastrar atualização", e);
        } finally {
            fecharConexao(con);
        }
    }

    public List<Atualizacao> listar() {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_atualizacao ORDER BY dt_atualizacao DESC, cd_atualizacao DESC";
        try (PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            List<Atualizacao> lista = new ArrayList<>();
            while (rs.next()) {
                lista.add(mapear(rs));
            }
            return lista;
        } catch (SQLException e) {
            throw traduzir("listar atualizações", e);
        } finally {
            fecharConexao(con);
        }
    }

    public List<Atualizacao> listarPorChamado(Long chamadoId) {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_atualizacao WHERE cd_chamado = ? "
                + "ORDER BY dt_atualizacao ASC, cd_atualizacao ASC";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, chamadoId);
            try (ResultSet rs = ps.executeQuery()) {
                List<Atualizacao> lista = new ArrayList<>();
                while (rs.next()) {
                    lista.add(mapear(rs));
                }
                return lista;
            }
        } catch (SQLException e) {
            throw traduzir("listar atualizações do chamado", e);
        } finally {
            fecharConexao(con);
        }
    }

    public Optional<Atualizacao> buscarPorId(Long id) {
        Connection con = abrirConexao();
        String sql = "SELECT " + COLUNAS + " FROM tb_zela_atualizacao WHERE cd_atualizacao = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapear(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw traduzir("buscar atualização", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean atualizar(Atualizacao a) {
        Connection con = abrirConexao();
        String sql = "UPDATE tb_zela_atualizacao SET ds_mensagem = ?, nm_autor = ? WHERE cd_atualizacao = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, a.getMensagem());
            ps.setString(2, a.getAutor());
            ps.setLong(3, a.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("atualizar atualização", e);
        } finally {
            fecharConexao(con);
        }
    }

    public boolean remover(Long id) {
        Connection con = abrirConexao();
        String sql = "DELETE FROM tb_zela_atualizacao WHERE cd_atualizacao = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw traduzir("remover atualização", e);
        } finally {
            fecharConexao(con);
        }
    }

    private Atualizacao mapear(ResultSet rs) throws SQLException {
        Atualizacao a = new Atualizacao();
        a.setId(rs.getLong("cd_atualizacao"));
        a.setChamadoId(rs.getLong("cd_chamado"));
        a.setMensagem(rs.getString("ds_mensagem"));
        a.setAutor(rs.getString("nm_autor"));
        String st = rs.getString("st_novo");
        a.setNovoStatus(st == null ? null : StatusChamado.valueOf(st));
        a.setDataAtualizacao(paraLocalDateTime(rs.getTimestamp("dt_atualizacao")));
        return a;
    }
}
