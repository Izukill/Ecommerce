package org.example.rest.dto.Categoria;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoriaSalvarRequestDTO {

    @Schema(description = "Categoria para as roupas da loja", example = "Moda Praia")
    @NotBlank(message = "O nome da categoria é obrigatório")
    private String nome;

    @Schema(description = "Colocar para mostrar na home", example = "true")
    @NotNull(message = "O boleano da home é obrigatório")
    private Boolean mostrarNaHome;

    @Schema(description = "Ordem de exibição na home", example = "1")
    @NotNull(message = "A ordem de exibição é obrigatória")
    private Integer ordemExibicao;


}
