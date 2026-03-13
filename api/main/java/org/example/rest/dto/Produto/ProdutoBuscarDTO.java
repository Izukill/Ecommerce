package org.example.rest.dto.Produto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.example.model.Categoria;

@Data
public class ProdutoBuscarDTO {

    @Schema(description = "Filtra pelo nome do produto", example = "Top Fitness")
    private String nome;

    @Schema(description = "Filtra pela categoria", example = "Moda Praia")
    private Categoria categoria;

    @Schema(description = "Número da página a ser retornada. Começa com zero.")
    private Integer numeroPagina = 0;

    @Schema(description = "Quantidade de registros a serem retornados por página.")
    private Integer tamanhoPagina = 10;
}
