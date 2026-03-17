package org.example.rest.dto.dashboard;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DashboardAdminDTO {

    private BigDecimal faturamentoMes;

    private Long produtosAtivos;

    private Long pedidosMes;

    private Long aguardandoEnvio;

    private List<PedidoResumoDTO> ultimosPedidos;





}
