package org.example.rest.dto.Categoria;

import lombok.Data;

import java.util.UUID;

@Data
public class CategoriaBuscarDTO {

    private String nome;

    private UUID lookupId;

    private Boolean ativo;


}
