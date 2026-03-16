package org.example.rest.dto.Pedido;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.rest.dto.ItemPedido.ItemPedidoSalvarRequestDTO;

import java.util.List;

@Data
public class PedidoCheckoutRequestDTO {

    @Schema(description = "Dados do cliente (novo ou existente)")
    @NotNull(message = "Os dados do cliente são obrigatórios")
    @Valid
    private ClienteCheckoutDTO cliente;

    @Schema(description = "Dados do endereço para a entrega")
    @NotNull(message = "O endereço de entrega é obrigatório")
    @Valid
    private EnderecoCheckoutDTO enderecoEntrega;

    @Schema(description = "Lista com os itens selecionados no carrinho")
    @NotEmpty(message = "O carrinho não pode estar vazio")
    @Valid
    private List<ItemPedidoSalvarRequestDTO> itens;
}