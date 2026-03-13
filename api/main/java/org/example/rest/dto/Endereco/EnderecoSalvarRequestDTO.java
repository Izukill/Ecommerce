package org.example.rest.dto.Endereco;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class EnderecoSalvarRequestDTO {


    @Schema(description = "CEP do endereço", example = "58400-000")
    @NotBlank(message = "O CEP é obrigatório")
    private String cep;

    @Schema(description = "Nome da rua, avenida, etc.", example = "Avenida Beira Mar")
    @NotBlank(message = "A rua é obrigatória")
    private String rua;

    @Schema(description = "Bairro do endereço", example = "Mangabeira")
    @NotBlank(message = "O bairro é obrigatório")
    private String bairro;

    @Schema(description = "Número da residência ou prédio", example = "1045")
    @NotBlank(message = "O número é obrigatório")
    private String numero;

    @Schema(description = "Complemento do Endereço (perto do posto, bloco, casa 2, etc.)", example = "Apto 202, Bloco A")
    private String complemento;

    @Schema(description = "Indica se o cliente escolheu a opção de pagar apenas no momento em que receber a encomenda", example = "true")
    @NotNull(message = "A opção de pagamento na entrega deve ser informada")
    private Boolean pagarNaEntrega;

}
