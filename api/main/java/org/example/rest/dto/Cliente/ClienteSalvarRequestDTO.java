package org.example.rest.dto.Cliente;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClienteSalvarRequestDTO {

    @Schema(description = "Nome completo do cliente", example = "Jaqueline Ferreira")
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Schema(description = "Email do cliente para login", example = "jaqueline@gmail.com")
    @NotBlank(message = "O email é obrigatório")
    @Email
    private String email;

    @Schema(description = "Senha de acesso", example = "senhaBoa")
    @NotBlank(message = "A senha é obrigatória")
    private String senha;

    @Schema(description = "Telefone de contato do cliente", example = "83 99999-9999")
    @NotBlank(message = "O telefone é obrigatório para contato")
    private String telefone;


}
