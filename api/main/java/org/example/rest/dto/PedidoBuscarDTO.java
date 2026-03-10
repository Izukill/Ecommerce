package org.example.rest.dto;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;
import org.example.model.EnumStatusPedido;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PedidoBuscarDTO {

    @Parameter(description = "Filtra os pedidos por um cliente específico")
    private UUID clienteId;

    @Parameter(description = "Filtra os pedidos pelo status atual")
    private EnumStatusPedido status;

    @Parameter(description = "Data inicial para buscar pedidos (Formato ISO)")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dataInicial;

    @Parameter(description = "Data final para buscar pedidos (Formato ISO)")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dataFinal;

}