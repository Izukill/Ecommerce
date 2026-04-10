package org.example.rest.dto.Dashboard;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DashboardAdminDTO {

    private BigDecimal faturamentoMes;

    private BigDecimal porcentagemPassada;

    private Long produtosAtivos;

    private Long pedidosMes;

    private Long aguardandoEnvio;

    private List<PedidoResumoDTO> ultimosPedidos;





}
