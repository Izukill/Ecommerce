package org.example.rest.dto.Pedido;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClienteCheckoutDTO {

    @Schema(description = "Nome do cliente em pedido")
    @NotBlank
    private String nome;

    @Schema(description = "Email do cliente em pedido")
    @NotBlank
    private String email;

    @Schema(description = "Cpf do cliente em pedido")
    @NotBlank
    private String cpf;

    @Schema(description = "Telefone do cliente em pedido")
    @NotBlank
    private String telefone;



}
