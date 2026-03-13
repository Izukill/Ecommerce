package org.example.rest.dto.Categoria;

import lombok.Data;

import java.util.UUID;

@Data
public class CategoriaReponseDTO {

    private UUID lookupId;

    private String nome;

    private boolean ativo;

}
