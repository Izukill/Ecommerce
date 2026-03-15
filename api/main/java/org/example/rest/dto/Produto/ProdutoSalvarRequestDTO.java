package org.example.rest.dto.Produto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.example.model.Categoria;
import org.example.rest.dto.VariacaoProduto.VariacaoProdutoSalvarRequestDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProdutoSalvarRequestDTO {

    @Schema(description = "Nome do produto", example = "Maiô Engana Mamãe")
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Schema(description = "Categoria do produto", example = "Moda Praia")
    @NotBlank(message = "A categoria é obrigatória")
    private Categoria categoria;

    @Schema(description = "Preço base do produto", example = "129.90")
    @NotNull(message = "O preço é obrigatório")
    @Positive
    private BigDecimal preco;

    @Schema(description = "Imagem do produto")
    @NotBlank(message = "A imagem é obrigatória")
    private String imagemUrl;

    @Schema(description = "Variacões do produto")
    private List<VariacaoProdutoSalvarRequestDTO> variacaoProduto;

    @Schema(description = "Descrição do produto")
    private String descricao;

    @Schema(description = "Ativo no sistema")
    private boolean ativo;

}
