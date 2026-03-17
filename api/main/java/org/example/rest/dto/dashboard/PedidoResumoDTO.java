package org.example.rest.dto.dashboard;

import lombok.Data;
import org.example.model.EnumStatusPedido;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PedidoResumoDTO {

    private UUID lookupId;

    private String clienteNome;

    private LocalDateTime dataHora;

    private EnumStatusPedido status;

    public PedidoResumoDTO(UUID lookupId, String clienteNome, LocalDateTime dataHora, EnumStatusPedido status) {
        this.clienteNome = clienteNome;
        this.dataHora = dataHora;
        this.lookupId = lookupId;
        this.status = status;
    }
}
