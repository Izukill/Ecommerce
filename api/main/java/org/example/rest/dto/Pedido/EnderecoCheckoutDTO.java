package org.example.rest.dto.Pedido;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EnderecoCheckoutDTO {

    @Schema(description = "Bairro do endereço do cliente em pedido")
    @NotBlank
    private String bairro;

    @Schema(description = "Logradouro do endereço do cliente em pedido")
    private String logradouro;

    @Schema(description = "Cep do endereço do cliente em pedido")
    @NotBlank
    private String cep;

    @Schema(description = "Numero do endereço do cliente em pedido")
    @NotNull
    private Integer numero;

    @Schema(description = "Cidade do endereço do cliente em pedido")
    @NotBlank
    private String cidade;

    @Schema(description = "Estado do endereço do cliente em pedido")
    @NotBlank
    private String estado;

    @Schema(description = "Complemento do endereço do cliente em pedido")
    private String complemento;

}
