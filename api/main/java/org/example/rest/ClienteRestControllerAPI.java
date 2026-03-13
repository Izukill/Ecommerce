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
import org.example.exception.EntidadeNaoEncontradaException;
import org.example.exception.MirlleException;
import org.example.rest.dto.Autenticacao.AlterarSenhaSalvarRequestDTO;
import org.example.rest.dto.Cliente.ClienteBuscarDTO;
import org.example.rest.dto.Cliente.ClienteResponseDTO;
import org.example.rest.dto.Cliente.ClienteSalvarRequestDTO;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

@Tag(name = "Clientes", description = "Gerenciamento de contas de clientes da loja")
public interface ClienteRestControllerAPI {



    @Operation(summary = "Criar um novo Cliente.",
            description = "Cria um novo Cliente com base na descrição informada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ClienteResponseDTO.class))),
            @ApiResponse(
                    responseCode = "400", description = "Erro ao cadastrar Cliente",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<ClienteResponseDTO> criar(@RequestBody(description = "Dados do cliente a ser criado.")
                                                 ClienteSalvarRequestDTO dto) throws MirlleException;


    @Operation(summary = "Alterar senha do cliente.",
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
    ResponseEntity<Void> alterarSenha(@Parameter(description = "LookupId do cliente.") UUID lookupId,
            @RequestBody AlterarSenhaSalvarRequestDTO dto) throws MirlleException, EntidadeNaoEncontradaException;


    @Operation(summary = "Recuperar um cliente existente.",
            description = "Recupera um cliente existente com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ClienteResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Cliente com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<ClienteResponseDTO> recuperarPor(@Parameter(description = "LookupId do cliente a ser recuperado.")
                                                    UUID lookupId) throws MirlleException, EntidadeNaoEncontradaException;

    @Operation(summary = "Atualizar um cliente existente.",
            description = "Atualiza um cliente existente com base no seu lookupId, permitindo atualização dos seus dados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ClienteResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Cliente com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<ClienteResponseDTO> atualizar(@Parameter(description = "LookupId do cliente a ser atualizado.")
                                                 UUID lookupId,
                                                 @RequestBody(description = "Dados do cliente a ser atualizado.")
                                                 ClienteSalvarRequestDTO dto) throws MirlleException, EntidadeNaoEncontradaException;

    @Operation(summary = "Remover um cliente existente.",
            description = "Remove um cliente existente com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204",
                    description = "Operação realizada com sucesso.",
                    content = @Content),
            @ApiResponse(responseCode = "400",
                    description = "Cliente com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<Void> remover(@Parameter(description = "LookupId do cliente a ser removido.")
                                 UUID lookupId) throws MirlleException, EntidadeNaoEncontradaException;

    @Operation(summary = "Recuperar clientes existentes.",
            description = "Recupera clientes existentes de forma paginada com base nos seguintes filtros opcionais: (nome, etc).")
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