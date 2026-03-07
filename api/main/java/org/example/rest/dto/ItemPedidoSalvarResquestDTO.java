package org.example.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class ItemPedidoSalvarResquestDTO {

    @Schema(description = "ID único da variação exata do produto escolhido (ex: Maiô Preto - Tamanho M)")
    @NotNull(message = "A variação do produto é obrigatória")
    private UUID variacaoProdutoId;

    @Schema(description = "Quantidade de peças desta variação que o cliente está comprando", example = "2")
    @NotNull(message = "A quantidade é obrigatória")
    @Min(value = 1, message = "A quantidade mínima para compra é 1")
    private Integer quantidade;

}
