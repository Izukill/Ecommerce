package org.example.rest.dto.Dashboard;

import lombok.Data;
import org.example.model.EnumStatusPedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PedidoResumoDTO {

    private UUID lookupId;

    private String clienteNome;

    private LocalDateTime dataHora;

    private EnumStatusPedido status;

    private BigDecimal valorTotal;

    public PedidoResumoDTO(UUID lookupId, String clienteNome, LocalDateTime dataHora, EnumStatusPedido status, BigDecimal valorTotal) {
        this.clienteNome = clienteNome;
        this.dataHora = dataHora;
        this.lookupId = lookupId;
        this.status = status;
        this.valorTotal = valorTotal;
    }
}
