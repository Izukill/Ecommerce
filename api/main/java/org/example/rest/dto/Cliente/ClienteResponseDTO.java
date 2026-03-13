package org.example.rest.dto.Cliente;

import lombok.Data;

import java.util.UUID;

@Data
public class ClienteResponseDTO {


    private UUID lookupId;

    private String nome;

    private String email;

    private String telefone;

}
