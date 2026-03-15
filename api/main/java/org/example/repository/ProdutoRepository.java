package org.example.repository;


import org.example.model.Categoria;
import org.example.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Optional<Produto> findByLookupId(UUID lookupId);

    Page<Produto> findByCategoriaAndAtivoTrue(Categoria categoria, Pageable pageable);

    Page<Produto> findByNomeContainingIgnoreCaseAndAtivoTrue(String nome, Pageable pageable);

    Page<Produto> findAll(Pageable pageable);


}
