package org.example.rest.dto;

import lombok.Data;
import org.example.model.EnumCargo;

import java.util.UUID;

@Data
public class AdministradorResponseDTO {

    private UUID lookupId;

    private String nome;

    private String email;

    private EnumCargo cargo;
}
