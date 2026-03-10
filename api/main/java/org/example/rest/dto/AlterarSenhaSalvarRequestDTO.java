package org.example.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AlterarSenhaSalvarRequestDTO {


    @Schema(description = "Senha velha a ser alterada")
    @NotBlank(message = "A senha velha é obrigatória")
    private String senhaVelha;

    @Schema(description = "Senha nova a ser vinculada a conta")
    @NotBlank(message = "A senha nova é obrigatória")
    private String senhaNova;

}
