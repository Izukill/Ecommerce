package org.example.rest.dto.Dashboard;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProdutoMaisVendidoDTO {
    private String nome;
    private Long quantidadeVendida;
    private BigDecimal receitaGerada;

    public ProdutoMaisVendidoDTO(String nome, Long quantidadeVendida, BigDecimal receitaGerada) {
        this.nome = nome;
        this.quantidadeVendida = quantidadeVendida;
        this.receitaGerada = receitaGerada;
    }
}