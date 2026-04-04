package org.example.repository;


import org.example.model.Cliente;
import org.example.model.EnumStatusPedido;
import org.example.model.Pedido;
import org.example.rest.dto.dashboard.PedidoResumoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    Optional<Pedido> findByLookupId(UUID lookupId);

    Optional<Pedido> findByPagamentoMercadoPagoId(Long mercadoId);

    Page<Pedido> findByCliente(Cliente cliente, Pageable pageable);

    Page<Pedido> findByStatus(EnumStatusPedido status, Pageable pageable);

    Page<Pedido> findByDataHoraBetween(LocalDateTime dataInicio, LocalDateTime dataFinal, Pageable pageable);

    List<Pedido> findByStatusAndDataExpiracaoBefore(EnumStatusPedido status, LocalDateTime dataAtual);

    @Query("""
        SELECT COALESCE(SUM(i.precoUnitario * i.quantidade),0)
        FROM Pedido p
        JOIN p.itens i
        WHERE p.status = 'PAGO' OR p.status = 'ENVIADO'
        AND p.dataHora BETWEEN :inicio AND :fim
    """)
    BigDecimal faturamentoMes(LocalDateTime inicio, LocalDateTime fim);


    @Query("""
        SELECT COUNT(p)
        FROM Pedido p
        WHERE p.dataHora BETWEEN :inicio AND :fim
    """)
    Long pedidosMes(LocalDateTime inicio, LocalDateTime fim);


    @Query("""
        SELECT COUNT(p)
        FROM Pedido p
        WHERE p.status = 'PAGO'
    """)
    Long aguardandoEnvio();


    @Query("""
        SELECT new org.example.rest.dto.dashboard.PedidoResumoDTO(
            p.lookupId,
            p.cliente.nome,
            p.dataHora,
            p.status,
            p.valorTotal
        )
        FROM Pedido p
        ORDER BY p.dataHora DESC
    """)
    List<PedidoResumoDTO> ultimosPedidos(org.springframework.data.domain.Pageable pageable);

}
