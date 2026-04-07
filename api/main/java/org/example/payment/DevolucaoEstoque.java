package org.example.payment;

import jakarta.transaction.Transactional;
import org.example.model.*;
import org.example.repository.PedidoRepository;
import org.example.repository.VariacaoProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DevolucaoEstoque {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private VariacaoProdutoRepository variacaoProdutoRepository;

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void cancelarPedidosNaoPagosEDevolverEstoque() {

        //busca todos os pedidos AGUARDANDO_PAGAMENTO que já passaram do tempo limite
        List<Pedido> pedidosExpirados = pedidoRepository.findByStatusAndDataExpiracaoBefore(
                EnumStatusPedido.AGUARDANDO_PAGAMENTO,
                LocalDateTime.now()
        );

        for (Pedido pedido : pedidosExpirados) {
            pedido.setStatus(EnumStatusPedido.CANCELADO);

            for (ItemPedido item : pedido.getItens()) {
                VariacaoProduto produto = item.getProduto();
                produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + item.getQuantidade());
                variacaoProdutoRepository.save(produto);
            }

            pedidoRepository.save(pedido);
        }
    }
}
