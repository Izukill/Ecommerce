package org.example.rest.dto.VariacaoProduto;

import java.util.UUID;
import lombok.Data;

@Data
public class VariacaoProdutoResponseDTO {

    private UUID lookupId;

    private String tamanho;

    private String cor;

    private Integer quantidadeEstoque;

    private String imagemUrl;


}
