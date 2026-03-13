package org.example.rest.dto.VariacaoProduto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.model.EnumTamanho;

@Data
public class VariacaoProdutoSalvarRequestDTO {

    @Schema(description = "Tamanho da peça", example = "M")
    @NotBlank(message = "O tamanho é obrigatório")
    private EnumTamanho tamanho;

    @Schema(description = "Cor da peça", example = "Preto")
    @NotBlank(message = "A cor é obrigatória")
    private String cor;

    @Schema(description = "Quantidade em estoque", example = "50")
    @NotNull(message = "a quantidade é obrigatória")
    @Min(0)
    private Integer quantidadeEstoque;


}
