package org.example.rest.dto.Endereco;

import lombok.Data;
import java.util.UUID;

@Data
public class EnderecoResponseDTO {

    private UUID lookupID;

    private String rua;

    private String cep;

    private String bairro;

    private Integer numero;

    private String complemento;

    private String logradouro;

    private String cidade;

    private String estado;





}
