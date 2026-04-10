package org.example.rest.dto.Categoria;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.UUID;

@Data
public class CategoriaBuscarDTO {

    @Schema(description = "Filtra pelo Nome da categoria", example = "Fitness")
    private String nome;

    @Schema(description = "Filtra pelo lookupId", example = "236FSDCH-dfhghty")
    private UUID lookupId;

    @Schema(description = "Filtra pelo status", example = "true")
    private Boolean ativo;


}
