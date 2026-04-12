package org.example.rest.dto.Dashboard;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FaturamentoMensalDTO {
    private Integer mes;
    private Integer ano;
    private BigDecimal valor;

    public FaturamentoMensalDTO(Integer mes, Integer ano, BigDecimal valor) {
        this.mes = mes;
        this.ano = ano;
        this.valor = valor;
    }
}