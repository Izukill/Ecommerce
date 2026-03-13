package org.example.rest.dto.Produto;

import lombok.Data;
import org.example.model.Categoria;
import org.example.rest.dto.VariacaoProduto.VariacaoProdutoResponseDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class ProdutoResponseDTO {

    private UUID lookupId;

    private String nome;

    private Categoria categoria;

    private BigDecimal preco;

    private String status;

    private List<VariacaoProdutoResponseDTO> variacoes;


}
