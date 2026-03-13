package org.example.rest.dto.Categoria;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoriaSalvarRequestDTO {

    @Schema(description = "Categoria para as roupas da loja", example = "Moda Praia")
    @NotBlank(message = "O nome da categoria é obrigatório")
    private String nome;


}
