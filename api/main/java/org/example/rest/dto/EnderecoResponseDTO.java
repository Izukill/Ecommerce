package org.example.rest.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class EnderecoResponseDTO {

    private UUID lookupID;

    private String rua;

    private String cep;

    private String bairro;

    private String numero;

    private String complemento;

    private boolean pagarNaEntrega;





}
