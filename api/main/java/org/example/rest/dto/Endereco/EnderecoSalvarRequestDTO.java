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
    @NotNull(message = "O número é obrigatório")
    private Integer numero;

    @Schema(description = "Complemento do endereço (perto do posto, bloco, casa 2, etc.)", example = "Apto 202, Bloco A")
    private String complemento;

    @Schema(description = "Cidade do endereço", example = "CG")
    @NotBlank(message = "a cidade é obrigatória")
    private String cidade;

    @Schema(description = "Estado do endereço", example = "PB")
    @NotBlank(message = "o estado é obrigatório")
    private String estado;


}
