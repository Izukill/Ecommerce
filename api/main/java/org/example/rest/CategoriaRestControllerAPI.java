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
import org.example.rest.dto.Categoria.CategoriaBuscarDTO;
import org.example.rest.dto.Categoria.CategoriaReponseDTO;
import org.example.rest.dto.Categoria.CategoriaSalvarRequestDTO;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

@Tag(name = "Categorias", description = "Gerenciamento de Categorias de roupa da loja")
public interface CategoriaRestControllerAPI {


    @Operation(summary = "Criar uma nova Categoria.",
            description = "Cria uma nova Categoria com base na descrição informada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoriaReponseDTO.class))),
            @ApiResponse(
                    responseCode = "400", description = "Erro ao cadastrar Categoria",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<CategoriaReponseDTO> criar(@RequestBody(description = "Dados da categoria a ser criada.")
                                              CategoriaSalvarRequestDTO dto) throws MirlleException;

    @Operation(summary = "Recuperar uma categoria existente.",
            description = "Recupera uma categoria existente com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoriaReponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Categoria com lookupId NÃO encontrada.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<CategoriaReponseDTO> recuperarPor(@Parameter(description = "LookupId da categoria a ser recuperada.")
                                                     UUID lookupId) throws MirlleException, EntidadeNaoEncontradaException;

    @Operation(summary = "Atualizar uma categoria existente.",
            description = "Atualiza uma categoria existente com base no seu lookupId, permitindo atualização dos seus dados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoriaReponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Categoria com lookupId NÃO encontrada.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<CategoriaReponseDTO> atualizar(@Parameter(description = "LookupId da categoria a ser atualizada.")
                                                  UUID lookupId,
                                                  @RequestBody(description = "Dados da categoria a ser atualizada.")
                                                  CategoriaSalvarRequestDTO dto) throws MirlleException, EntidadeNaoEncontradaException;

    @Operation(summary = "Remover uma categoria existente.",
            description = "Remove uma categoria existente e todos os produtos vinculados a ela com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204",
                    description = "Operação realizada com sucesso.",
                    content = @Content),
            @ApiResponse(responseCode = "400",
                    description = "Categoria com lookupId NÃO encontrada.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<Void> remover(@Parameter(description = "LookupId da categoria a ser removida.")
                                 UUID lookupId) throws MirlleException, EntidadeNaoEncontradaException;

    @Operation(summary = "Recuperar as categorias existentes.",
            description = "Recupera categorias de forma paginada. Permite filtros opcionais como nome e status ativo/inativo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso."),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<Page<CategoriaReponseDTO>> buscar(@ParameterObject CategoriaBuscarDTO dto, @ParameterObject Pageable pageable) throws MirlleException;

}
