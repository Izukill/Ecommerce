package org.example.repository;

import org.example.model.Cliente;
import org.example.model.Pessoa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByLookupId(UUID lookupId);

    Optional<Cliente> findByEmail(String email);

    @Query("SELECT c FROM Cliente c " +
            "WHERE (:nome IS NULL OR LOWER(c.nome) LIKE LOWER(CONCAT('%', CAST(:nome AS String), '%'))) " +
            "AND (:email IS NULL OR LOWER(c.email) LIKE LOWER(CONCAT('%', CAST(:email AS String), '%'))) " +
            "AND (:telefone IS NULL OR c.telefone LIKE CONCAT('%', CAST(:telefone AS String), '%'))")
    Page<Cliente> buscarComFiltros(
            @Param("nome") String nome,
            @Param("email") String email,
            @Param("telefone") String telefone,
            Pageable pageable
    );



}
