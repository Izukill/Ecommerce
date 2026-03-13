package org.example.rest.dto.Cliente;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ClienteBuscarDTO {

    @Schema(description = "Filtra pela data do cadastro do Cliente.")
    private LocalDate dataCadastro;

    @Schema(description = "Filtra pelo telefone do Cliente.")
    private String telefone;

    @Schema(description = "Filtra pelo nome do Cliente.")
    private String nome;

    @Schema(description = "Filtre pelo email do Cliente.")
    private String email;

    @Schema(description = "Número da página a ser retornada na paginação. Começa com zero.")
    private Integer númeroPágina = 0;

    @Schema(description = "Quantidade de registros a serem retornados por página.")
    private Integer tamanhoPágina = 10;

}
