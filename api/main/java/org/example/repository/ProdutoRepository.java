package org.example.repository;


import org.example.model.Categoria;
import org.example.model.Produto;
import org.example.rest.dto.Dashboard.ProdutoMaisVendidoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Optional<Produto> findByLookupId(UUID lookupId);

    Page<Produto> findByAtivoTrue(Pageable pageable);

    Page<Produto> findByCategoria(Categoria categoria, Pageable pageable);

    List<Produto> findByCategoria(Categoria categoria);

    Page<Produto> findByCategoriaIsNull(Pageable pageable);

    Page<Produto> findByCategoriaAndAtivoTrue(Categoria categoria, Pageable pageable);

    Page<Produto> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    Page<Produto> findByNomeContainingIgnoreCaseAndAtivoTrue(String nome, Pageable pageable);

    Page<Produto> findAll(Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(ip) > 0 THEN true ELSE false END FROM ItemPedido ip WHERE ip.produto.produto = :produto")
    boolean isProdutoVendido(@Param("produto") Produto produto);

    @Query("""
    SELECT COUNT(p)
    FROM Produto p
    WHERE p.ativo = true
    """)
    Long contarProdutosAtivos();

    @Query("SELECT p FROM Produto p LEFT JOIN p.categoria c WHERE " +
            "(:nome IS NULL OR :nome = '' OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
            "(:categoriaId IS NULL OR c.lookupId = :categoriaId) AND " +
            "(:semCategoria IS NULL OR :semCategoria = false OR c IS NULL) AND " +
            "(:ativo IS NULL OR p.ativo = :ativo)")
    Page<Produto> buscarPorFiltros(
            @Param("nome") String nome,
            @Param("categoriaId") UUID categoriaId,
            @Param("semCategoria") Boolean semCategoria,
            @Param("ativo") Boolean ativo,
            Pageable pageable);


    @Query("""
        SELECT new org.example.rest.dto.Dashboard.ProdutoMaisVendidoDTO(
            ip.produto.produto.nome,
            SUM(ip.quantidade),
            SUM(ip.precoUnitario * ip.quantidade)
        )
        FROM ItemPedido ip
        JOIN ip.pedido p
        WHERE p.status = 'PAGO' OR p.status = 'ENVIADO'
        GROUP BY ip.produto.produto.nome
        ORDER BY SUM(ip.quantidade) DESC
    """)
    List<ProdutoMaisVendidoDTO> produtosMaisVendidos(Pageable pageable);


}
