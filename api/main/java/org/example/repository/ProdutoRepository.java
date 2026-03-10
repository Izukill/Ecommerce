package org.example.repository;


import org.example.model.EnumCategoria;
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

    Page<Produto> findByAtivoTrue(Pageable pageable);

    Page<Produto> findByCategoriaAndAtivoTrue(EnumCategoria categoria, Pageable pageable);

    Page<Produto> findByNomeContainingIgnoreCaseAndAtivoTrue(String nome, Pageable pageable);


}
