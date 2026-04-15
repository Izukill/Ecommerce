package org.example.repository;


import org.example.model.Cliente;
import org.example.model.EnumStatusPedido;
import org.example.model.Pedido;
import org.example.rest.dto.Dashboard.FaturamentoMensalDTO;
import org.example.rest.dto.Dashboard.PedidoResumoDTO;
import org.example.rest.dto.Dashboard.PedidosPorStatusDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("SELECT p FROM Pedido p WHERE " +
            "(:clienteNome IS NULL OR LOWER(p.cliente.nome) LIKE LOWER(CONCAT('%', CAST(:clienteNome AS String), '%'))) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(CAST(:precoMin AS BigDecimal) IS NULL OR p.valorTotal >= :precoMin) AND " +
            "(CAST(:dataInicial AS timestamp) IS NULL OR p.dataHora >= :dataInicial) AND " +
            "(CAST(:dataFinal AS timestamp) IS NULL OR p.dataHora <= :dataFinal)")
    Page<Pedido> buscarComFiltros(
            @Param("clienteNome") String clienteNome,
            @Param("status") EnumStatusPedido status,
            @Param("precoMin") BigDecimal precoMin,
            @Param("dataInicial") LocalDateTime dataInicial,
            @Param("dataFinal") LocalDateTime dataFinal,
            Pageable pageable
    );

    @Query("""
        SELECT COALESCE(SUM(p.valorTotal), 0)
        FROM Pedido p
        WHERE (p.status = 'PAGO' OR p.status = 'ENVIADO')
        AND p.dataHora BETWEEN :inicio AND :fim
    """)
    BigDecimal faturamentoMes(LocalDateTime inicio, LocalDateTime fim);

    @Query("""
        SELECT new org.example.rest.dto.Dashboard.FaturamentoMensalDTO(
            MONTH(p.dataHora),
            YEAR(p.dataHora),
            COALESCE(SUM(p.valorTotal), 0)
        )
        FROM Pedido p
        WHERE (p.status = 'PAGO' OR p.status = 'ENVIADO')
        AND p.dataHora >= :inicio
        GROUP BY YEAR(p.dataHora), MONTH(p.dataHora)
        ORDER BY YEAR(p.dataHora), MONTH(p.dataHora)
    """)
    List<FaturamentoMensalDTO> faturamentoUltimosMeses(LocalDateTime inicio);

    @Query("""
        SELECT COUNT(p)
        FROM Pedido p
        WHERE p.dataHora BETWEEN :inicio AND :fim
    """)
    Long pedidosMes(LocalDateTime inicio, LocalDateTime fim);

    @Query("""
        SELECT new org.example.rest.dto.Dashboard.PedidosPorStatusDTO(
            CAST(p.status AS string),
            COUNT(p)
        )
        FROM Pedido p
        GROUP BY p.status
    """)
    List<PedidosPorStatusDTO> pedidosPorStatus();


    @Query("""
        SELECT COUNT(p)
        FROM Pedido p
        WHERE p.status = 'PAGO'
    """)
    Long aguardandoEnvio();


    @Query("""
        SELECT new org.example.rest.dto.Dashboard.PedidoResumoDTO(
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
