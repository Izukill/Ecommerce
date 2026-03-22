package org.example.rest.dto.Pedido;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.model.Pedido;
import org.example.rest.dto.Pix.PixResponseDTO;

@Data
@AllArgsConstructor
public class CheckoutResponseDTO {
    private PedidoResponseDTO pedido;
    private PixResponseDTO pix;
}