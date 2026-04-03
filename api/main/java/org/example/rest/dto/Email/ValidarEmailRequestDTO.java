package org.example.rest.dto.Email;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ValidarEmailRequestDTO {

    @Schema(description = "Email do usuario a ser verificado", example = "example@gmail.com")
    @NotBlank
    @Email
    private String email;

    @Schema(description = "Código de verificação do email", example = "145679")
    @NotBlank
    private String codigo;

}
