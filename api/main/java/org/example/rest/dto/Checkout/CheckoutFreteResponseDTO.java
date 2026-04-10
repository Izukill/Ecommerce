package org.example.rest.dto.Checkout;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CheckoutFreteResponseDTO {

    @Schema(description = "LookupId da config da loja", example = "HDFVH5dfg56Gfh-asf45gh")
    private UUID lookupId;

    @Schema(description = "Valor do frete atualmente disposto pela loja", example = "35.00")
    private BigDecimal frete;

}
