package org.example.rest.dto.Endereco;

import lombok.Data;
import java.util.UUID;

@Data
public class EnderecoResponseDTO {

    private UUID lookupId;

    private String rua;

    private String cep;

    private String bairro;

    private Integer numero;

    private String complemento;

    private String cidade;

    private String estado;

    private Boolean ativo;





}
