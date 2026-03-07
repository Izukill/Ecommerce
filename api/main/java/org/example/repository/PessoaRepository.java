package org.example.repository;

import org.example.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;


public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

    UserDetails findByEmail(String email);

}
