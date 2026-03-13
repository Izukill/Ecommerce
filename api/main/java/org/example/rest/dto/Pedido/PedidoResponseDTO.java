package org.example.rest.dto.Pedido;

import lombok.Data;
import org.example.model.EnumStatusPedido;
import org.example.rest.dto.ItemPedido.ItemPedidoResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class PedidoResponseDTO {

    private UUID lookupId;

    private LocalDateTime dataHora;

    private EnumStatusPedido status;

    private BigDecimal valorTotal;

    //dados para exibição resumida
    private String nomeCliente;

    private String cepEntrega;

    private List<ItemPedidoResponseDTO> itens;



}
