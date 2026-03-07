package org.example.rest.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.model.EnumCargo;

@Data
public class AdministradorSalvarRequestDTO {

    @Schema(description = "Nome completo do administrador", example = "Jaqueline Ferreira")
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Schema(description = "Email do administrador para login", example = "jaqueline@gmail.com")
    @NotBlank(message = "O email é obrigatório")
    @Email
    private String email;

    @Schema(description = "Senha de acesso", example = "senhaBoa")
    @NotBlank(message = "A senha é obrigatória")
    private String senha;

    @Schema(description = "Cargo ocupado pelo administrador", example = "FUNCIONARIO")
    @NotBlank(message = "O cargo é obrigatório")
    private EnumCargo cargo;

    @Schema(description = "Caso seja ativado o ADM possui permissão total ao sistema", example = "true")
    @NotBlank(message = "A permissão ou negação é obrigatória")
    private boolean permissaoTotal;



}
