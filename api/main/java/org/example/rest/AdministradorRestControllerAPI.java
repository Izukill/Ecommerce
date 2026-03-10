package org.example.rest;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.exception.MirlleException;
import org.example.rest.dto.*;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

@Tag(name = "Administradores", description = "Gerenciamento de Equipe da Loja")
@SecurityRequirement(name = "bearerAuth")
public interface AdministradorRestControllerAPI {

    @Operation(summary = "Cadastrar Administrador", description = "Cria um novo acesso de administrador.")
    @ApiResponse(
            responseCode = "201", description = "Administrador criado com sucesso.",
            content = @Content(mediaType = "application/json",
            schema = @Schema(implementation = AdministradorResponseDTO.class)))
    @ApiResponse(
            responseCode = "400", description = "Erro ao cadastrar Administrador",
            content = @Content(mediaType = "application/json",
            schema = @Schema(implementation = ProblemDetail.class)))
    @ApiResponse(responseCode = "500",
            description = "Erro inesperado.",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ProblemDetail.class)))

    ResponseEntity<AdministradorResponseDTO> criar(@RequestBody AdministradorSalvarRequestDTO dto) throws Exception;

    @Operation(summary = "Atualizar um administrador existente.",
            description = "Atualiza um administrador existente com base no seu lookupId, permitindo atualização dos seus dados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AdministradorResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Administrador com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<AdministradorResponseDTO> atualizar(@Parameter(description = "LookupId do administrador a ser atualizado.")
                                                 UUID lookupId,
                                                 @RequestBody(description = "Dados do administrador a ser atualizado.")
                                                 AdministradorSalvarRequestDTO dto) throws MirlleException;

    @Operation(summary = "Remover um administrador existente.",
            description = "Remove um administrador existente com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204",
                    description = "Operação realizada com sucesso.",
                    content = @Content),
            @ApiResponse(responseCode = "400",
                    description = "Administrador com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<Void> remover(@Parameter(description = "LookupId do administrador a ser removido.")
                                 UUID lookupId) throws MirlleException;

    @Operation(summary = "Recuperar um administrador existente.",
            description = "Recupera um administrador existente com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AdministradorResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Administrador com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class)))}
    )
    ResponseEntity<AdministradorResponseDTO> recuperarPor(@Parameter(description = "UUID do Admin") UUID lookupId) throws Exception;


    @Operation(summary = "Alterar senha do administrador.",
            description = "Exige a senha atual para cadastrar uma nova.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204",
                    description = "Senha alterada com sucesso. Nenhum conteúdo retornado no corpo da resposta."),
            @ApiResponse(responseCode = "400",
                    description = "Erro de validação: Senha atual incorreta, ou a nova senha não atende aos requisitos.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<Void> alterarSenha(@Parameter(description = "LookupId do administrador.") UUID lookupId,
                                      @RequestBody AlterarSenhaSalvarRequestDTO dto) throws Exception;

    @Operation(summary = "Recuperar administradores existentes.",
            description = "Recupera administradores existentes de forma paginada com base nos seguintes filtros opcionais: (nome, etc).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class, contentSchema = ClienteResponseDTO.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<Page<ClienteResponseDTO>> buscar(@ParameterObject ClienteBuscarDTO dto) throws MirlleException;




}
