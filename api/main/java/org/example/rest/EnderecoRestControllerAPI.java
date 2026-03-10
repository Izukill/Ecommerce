package org.example.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.exception.MirlleException;
import org.example.rest.dto.*;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

@Tag(name = "Endereços", description = "Gerenciamento de Endereços do cliente")
@SecurityRequirement(name = "bearerAuth")
public interface EnderecoRestControllerAPI {


    @Operation(summary = "Retornar todos os Endereços.",
            description = "Retorna todos os endereços, sem restrição alguma de quantidade.",
            tags = { "endereco" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = EnderecoResponseDTO.class)))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<List<EnderecoResponseDTO>> listar() throws MirlleException;

    @Operation(summary = "Criar um novo Endereço.",
            description = "Cria um novo Endereço com base na descrição informada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EnderecoResponseDTO.class))),
            @ApiResponse(
                    responseCode = "400", description = "Erro ao cadastrar Endereço",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),

            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<EnderecoResponseDTO> criar(@RequestBody(description = "Dados do endereço a ser criado.")
                                                  EnderecoSalvarRequestDTO dto) throws MirlleException;

    @Operation(summary = "Recuperar um endereço existente.",
            description = "Recupera um endereço existente com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EnderecoResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Endereço com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<EnderecoResponseDTO> recuperarPor(@Parameter(description = "LookupId do endereço a ser recuperado.")
                                                     UUID lookupId) throws MirlleException;

    @Operation(summary = "Atualizar um endereço existente.",
            description = "Atualiza um endereço existente com base no seu lookupId, permitindo atualização dos seus dados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EnderecoResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Endereço com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<EnderecoResponseDTO> atualizar(@Parameter(description = "LookupId do endereço a ser atualizado.")
                                                  UUID lookupId,
                                                  @RequestBody(description = "Dados do endereço a ser atualizado.")
                                                  EnderecoSalvarRequestDTO dto) throws MirlleException;

    @Operation(summary = "Remover um endereço existente.",
            description = "Remove um endereço existente com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204",
                    description = "Operação realizada com sucesso.",
                    content = @Content),
            @ApiResponse(responseCode = "400",
                    description = "Endereço com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<Void> remover(@Parameter(description = "LookupId do endereço a ser removido.")
                                 UUID lookupId) throws MirlleException;





}
