package org.example.repository;

import org.example.model.Categoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findByLookupId(UUID lookupId);

    boolean existsByNomeIgnoreCase(String nome);

    @Query("SELECT c FROM Categoria c WHERE " +
            "(:nome IS NULL OR LOWER(c.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
            "(:ativo IS NULL OR c.ativo = :ativo)")
    Page<Categoria> buscarPorFiltros(@Param("nome") String nome, @Param("ativo") Boolean ativo, Pageable pageable);
}
