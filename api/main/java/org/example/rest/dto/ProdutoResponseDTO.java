package org.example.rest.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class ProdutoResponseDTO {

    private UUID lookupId;

    private String nome;

    private String categoria;

    private BigDecimal preco;

    private String status;

    private List<VariacaoProdutoResponseDTO> variacoes;


}
