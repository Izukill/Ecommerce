package org.example.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class PedidoCheckoutRequestDTO {


    @Schema(description = "Id do endereço escolhido para entrega")
    @NotNull(message = "O endereço é obrigatório")
    private UUID enderecoEntregaId;

    @Schema(description = "Lista com os itens selecionados no carrinho")
    @NotEmpty(message = "O carrinho não pode estar vazio")
    @Valid
    private List<ItemPedidoSalvarRequestDTO> itens;








}
