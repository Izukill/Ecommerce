package org.example.rest.dto.Pedido;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.model.EnumStatusPedido;

@Data
public class PedidoStatusUpdateRequestDTO {

    @Schema(description = "Novo status do pedido", example = "AGUARDANDO_PAGAMENTO")
    @NotNull(message = "o status do pedido é obritagório")
    private EnumStatusPedido status;


}
