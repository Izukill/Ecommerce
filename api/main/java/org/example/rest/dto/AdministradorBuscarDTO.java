package org.example.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.example.model.EnumCargo;

import java.util.UUID;

@Data
public class AdministradorBuscarDTO {

    @Schema(description = "Filtra pelo cargo do Administrador.")
    private EnumCargo cargo;

    @Schema(description = "Filtra pelo nome do Administrador.")
    private String nome;

    @Schema(description = "Filtre pelo email do Administrador.")
    private String email;

    @Schema(description = "Número da página a ser retornada na paginação. Começa com zero.")
    private Integer númeroPágina = 0;

    @Schema(description = "Quantidade de registros a serem retornados por página.")
    private Integer tamanhoPágina = 10;


}
