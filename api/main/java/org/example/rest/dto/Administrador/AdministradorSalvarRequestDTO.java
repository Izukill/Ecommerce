package org.example.rest.dto.Administrador;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotNull(message = "O cargo é obrigatório")
    private EnumCargo cargo;

    @Schema(description = "Caso seja ativado o ADM possui permissão total ao sistema", example = "true")
    @NotNull(message = "A permissão ou negação é obrigatória")
    private Boolean permissaoTotal;

    @Schema(description = "Permissão pra página de pedidos", example = "true")
    @NotNull
    private Boolean pedidosPage;

    @Schema(description = "Permissão pra página de produtos", example = "true")
    @NotNull
    private Boolean produtosPage;

    @Schema(description = "Permissão pra página de categorias", example = "true")
    @NotNull
    private Boolean categoriasPage;

    @Schema(description = "Permissão pra página de clientes", example = "true")
    @NotNull
    private Boolean clientePage;

    @Schema(description = "Permissão pra página de relatórios", example = "true")
    @NotNull
    private Boolean relatoriosPage;



}
