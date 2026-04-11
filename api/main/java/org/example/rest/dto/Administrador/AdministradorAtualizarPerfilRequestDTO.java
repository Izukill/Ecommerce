package org.example.rest.dto.Administrador;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdministradorAtualizarPerfilRequestDTO {

    @Schema(description = "Nome do admin atualizado", example = "Jaqueline ferreira")
    @NotBlank(message = "O nome é obrigatório")
    private String nome;
}