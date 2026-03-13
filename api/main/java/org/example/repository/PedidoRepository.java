package org.example.repository;


import org.example.model.Cliente;
import org.example.model.EnumStatusPedido;
import org.example.model.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    Optional<Pedido> findByLookupId(UUID lookupId);

    Page<Pedido> findByCliente(Cliente cliente, Pageable pageable);

    Page<Pedido> findByStatus(EnumStatusPedido status, Pageable pageable);

    Page<Pedido> findByDataHoraBetween(LocalDateTime dataInicio, LocalDateTime dataFinal, Pageable pageable);
}
