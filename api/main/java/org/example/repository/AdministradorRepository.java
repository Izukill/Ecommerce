package org.example.repository;

import org.example.model.Administrador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long>{

    Optional<Administrador> findByLookupId(UUID lookupId);

    Optional<Administrador> findByEmail(String email);

    Page<Administrador> findByEmail(String email, Pageable pageable);

    Page<Administrador> findByNome(String nome, Pageable pageable);

}
