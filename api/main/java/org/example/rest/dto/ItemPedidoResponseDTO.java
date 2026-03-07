package org.example.rest.dto;

import lombok.Data;
import org.example.model.EnumTamanho;
import org.example.model.VariacaoProduto;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ItemPedidoResponseDTO {

    private UUID lookupId;

    private String nomeProduto;

    private String tamanho;

    private String cor;

    private Integer quantidade;

    private BigDecimal precoUnitario;



}
