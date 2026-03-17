package org.example.service;



import org.example.repository.PedidoRepository;
import org.example.repository.ProdutoRepository;
import org.example.rest.dto.dashboard.DashboardAdminDTO;
import org.example.rest.dto.dashboard.PedidoResumoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardAdminService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;



    public DashboardAdminDTO buscarDashboard() {

        LocalDate hoje = LocalDate.now();

        LocalDateTime inicioMes = hoje.withDayOfMonth(1).atStartOfDay();
        LocalDateTime fimMes = hoje.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        BigDecimal faturamento = pedidoRepository.faturamentoMes(inicioMes, fimMes);

        Long pedidosMes = pedidoRepository.pedidosMes(inicioMes, fimMes);

        Long produtosAtivos = produtoRepository.contarProdutosAtivos();

        Long aguardandoEnvio = pedidoRepository.aguardandoEnvio();

        List<PedidoResumoDTO> ultimosPedidos =
                pedidoRepository.ultimosPedidos(PageRequest.of(0,4));


        DashboardAdminDTO dto = new DashboardAdminDTO();

        dto.setFaturamentoMes(faturamento);
        dto.setProdutosAtivos(produtosAtivos);
        dto.setAguardandoEnvio(aguardandoEnvio);
        dto.setPedidosMes(pedidosMes);
        dto.setUltimosPedidos(ultimosPedidos);

        return dto;

    }
}