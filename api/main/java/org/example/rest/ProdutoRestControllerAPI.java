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
import org.example.rest.dto.ProdutoBuscarDTO;
import org.example.rest.dto.ProdutoResponseDTO;
import org.example.rest.dto.ProdutoSalvarRequestDTO;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

@Tag(name = "Produtos", description = "Gerenciamento de Produtos")
public interface ProdutoRestControllerAPI {

    @Operation(summary = "Retornar todos os Produtos.",
            description = "Retorna todos os produtos, sem restrição alguma de quantidade.",
            tags = { "produto" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ProdutoResponseDTO.class)))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<List<ProdutoResponseDTO>> listar() throws MirlleException;

    @Operation(summary = "Criar um novo Produto.",
            description = "Cria um novo Produto com base na descrição informada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProdutoResponseDTO.class))),
            @ApiResponse(
                    responseCode = "400", description = "Erro ao cadastrar Produto",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),

            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<ProdutoResponseDTO> adicionar(@RequestBody(description = "Dados do produto a ser criado.")
                                                 ProdutoSalvarRequestDTO dto) throws MirlleException;

    @Operation(summary = "Recuperar um produto existente.",
            description = "Recupera um produto existente com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProdutoResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Produto com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<ProdutoResponseDTO> recuperarPor(@Parameter(description = "LookupId do produto a ser recuperado.")
                                                    UUID lookupId) throws MirlleException;

    @Operation(summary = "Atualizar um produto existente.",
            description = "Atualiza um produto existente com base no seu lookupId, permitindo atualização dos seus dados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProdutoResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Produto com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<ProdutoResponseDTO> atualizar(@Parameter(description = "LookupId do produto a ser atualizado.")
                                                 UUID lookupId,
                                                 @RequestBody(description = "Dados do produto a ser atualizado.")
                                                 ProdutoSalvarRequestDTO dto) throws MirlleException;

    @Operation(summary = "Remover um produto existente.",
            description = "Remove um produto existente com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204",
                    description = "Operação realizada com sucesso.",
                    content = @Content),
            @ApiResponse(responseCode = "400",
                    description = "Produto com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<Void> remover(@Parameter(description = "LookupId do produto a ser removido.")
                                 UUID lookupId) throws MirlleException;

    @Operation(summary = "Recuperar produtos existentes.",
            description = "Recupera produtos existentes de forma paginada com base nos seguintes filtros opcionais: (nome, etc).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class, contentSchema = ProdutoResponseDTO.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<Page<ProdutoResponseDTO>> buscar(@ParameterObject ProdutoBuscarDTO dto) throws MirlleException;


}
