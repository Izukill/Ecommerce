package org.example.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProdutoSalvarRequestDTO {

    @Schema(description = "Nome do produto", example = "Maiô Engana Mamãe")
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Schema(description = "Categoria do produto", example = "Moda Praia")
    @NotBlank(message = "A categoria é obrigatória")
    private String categoria;

    @Schema(description = "Preço base do produto", example = "129.90")
    @NotNull(message = "O preço é obrigatório")
    @Positive
    private BigDecimal preco;

    @Schema(description = "Status do produto (Ativo/Inativo)")
    @NotNull(message = "O status é obrigatório")
    private boolean ativo;


}
