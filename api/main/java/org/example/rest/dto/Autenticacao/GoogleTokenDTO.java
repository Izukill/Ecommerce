package org.example.rest.dto.Autenticacao;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class GoogleTokenDTO {

    @NotBlank(message = "O token do Google não pode ser vazio")
    private String token;

}