package org.example.repository;

import org.example.model.CheckoutFrete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CheckoutFreteRepository extends JpaRepository<CheckoutFrete, Long> {

    Optional<CheckoutFrete> findByLookupId(UUID lookupId);

}
