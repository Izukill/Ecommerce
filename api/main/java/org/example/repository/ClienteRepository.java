package org.example.repository;

import org.example.model.Cliente;
import org.example.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByLookupId(UUID lookupId);

    Optional<Cliente> findByEmail(String email);



}
