package org.example.repository;


import org.example.model.VariacaoProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VariacaoProdutoRepository extends JpaRepository<VariacaoProduto, Long> {

    Optional<VariacaoProduto> findByLookupId(UUID lookupId);
}
