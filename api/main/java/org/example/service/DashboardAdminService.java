package org.example.service;



import org.example.repository.PedidoRepository;
import org.example.repository.ProdutoRepository;
import org.example.rest.dto.Dashboard.DashboardAdminDTO;
import org.example.rest.dto.Dashboard.PedidoResumoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

        //para pegar o faturamento
        LocalDateTime inicioMes = hoje.withDayOfMonth(1).atStartOfDay();
        LocalDateTime fimMes = hoje.withDayOfMonth(hoje.lengthOfMonth()).atTime(23, 59, 59);

        //para pegar a % do mês anterior
        LocalDate mesPassado = hoje.minusMonths(1);
        LocalDateTime inicioMesPassado = mesPassado.withDayOfMonth(1).atStartOfDay();
        LocalDateTime fimMesPassado = mesPassado.withDayOfMonth(mesPassado.lengthOfMonth()).atTime(23, 59, 59);

        BigDecimal faturamentoAtual = pedidoRepository.faturamentoMes(inicioMes, fimMes);
        if (faturamentoAtual == null) faturamentoAtual = BigDecimal.ZERO;

        BigDecimal faturamentoAnterior = pedidoRepository.faturamentoMes(inicioMesPassado, fimMesPassado);
        if (faturamentoAnterior == null) faturamentoAnterior = BigDecimal.ZERO;

        Long pedidosMes = pedidoRepository.pedidosMes(inicioMes, fimMes);

        Long produtosAtivos = produtoRepository.contarProdutosAtivos();

        Long aguardandoEnvio = pedidoRepository.aguardandoEnvio();

        List<PedidoResumoDTO> ultimosPedidos =
                pedidoRepository.ultimosPedidos(PageRequest.of(0,4));


        DashboardAdminDTO dto = new DashboardAdminDTO();

        BigDecimal percentualCrescimento = BigDecimal.ZERO;

        if (faturamentoAnterior.compareTo(BigDecimal.ZERO) > 0) {
            //calcula o percentual pra mostrar no front
            percentualCrescimento = faturamentoAtual.subtract(faturamentoAnterior)
                    .divide(faturamentoAnterior, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        } else if (faturamentoAtual.compareTo(BigDecimal.ZERO) > 0) {
            percentualCrescimento = new BigDecimal("100");
        }

        dto.setFaturamentoMes(faturamentoAtual);
        dto.setPorcentagemPassada(percentualCrescimento);
        dto.setProdutosAtivos(produtosAtivos);
        dto.setAguardandoEnvio(aguardandoEnvio);
        dto.setPedidosMes(pedidosMes);
        dto.setUltimosPedidos(ultimosPedidos);

        return dto;

    }
}