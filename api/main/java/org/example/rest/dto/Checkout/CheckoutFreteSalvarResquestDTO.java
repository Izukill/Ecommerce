package org.example.rest.dto.Checkout;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CheckoutFreteSalvarResquestDTO {

    @Schema(description = "O frete que será passado nos pedidos", example = "35.0")
    @NotNull(message = "o frete é obrigatório")
    @PositiveOrZero(message = "O frete não pode ser negativo.")
    private BigDecimal frete;

}
