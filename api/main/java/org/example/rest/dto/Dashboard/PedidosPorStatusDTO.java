package org.example.rest.dto.Dashboard;

import lombok.Data;

@Data
public class PedidosPorStatusDTO {
    private String status;
    private Long quantidade;

    public PedidosPorStatusDTO(String status, Long quantidade) {
        this.status = status;
        this.quantidade = quantidade;
    }
}