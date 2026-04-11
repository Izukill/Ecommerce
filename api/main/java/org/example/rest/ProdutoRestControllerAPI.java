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
import org.example.rest.dto.Produto.ProdutoBuscarDTO;
import org.example.rest.dto.Produto.ProdutoResponseDTO;
import org.example.rest.dto.Produto.ProdutoSalvarRequestDTO;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@Tag(name = "Produtos", description = "Gerenciamento de Produtos")
public interface ProdutoRestControllerAPI {


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
    ResponseEntity<ProdutoResponseDTO> criar(@RequestBody(description = "Dados do produto a ser criado.")
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

    @Operation(summary = "Recuperar os produtos existentes (Vitrine).",
            description = "Recupera produtos ativos de forma paginada. Permite filtros opcionais como nome e categoria.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso."),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<Page<ProdutoResponseDTO>> buscar(@ParameterObject ProdutoBuscarDTO dto, @ParameterObject Pageable pageable) throws MirlleException, EntidadeNaoEncontradaException;

    @Operation(summary = "Ativar um produto desativado (admin).",
            description = "Ativa um produto que o admin desativou através do atalho da tela de produtos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso."),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @PatchMapping("/{lookupId}/ativar")
    ResponseEntity<Void> ativar(@PathVariable("lookupId") UUID lookupId) throws MirlleException;

    @Operation(summary = "Aplicar promoção em uma categoria inteira.",
            description = "Aplica um percentual de desconto a todos os produtos de uma categoria específica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Promoção aplicada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Erro de validação (ex: desconto fora de 1 a 99).",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500", description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/categoria/{categoriaId}/promocao")
    ResponseEntity<Void> aplicarPromocaoCategoria(
            @Parameter(description = "LookupId da categoria.") @PathVariable("categoriaId") UUID categoriaId,
            @Parameter(description = "Percentual do desconto (Ex: 15 para 15%).") @RequestParam("desconto") BigDecimal percentualDesconto) throws MirlleException;

    @Operation(summary = "Remover promoção de uma categoria.",
            description = "Remove o preço promocional de todos os produtos vinculados a esta categoria, voltando ao preço original.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Promoção removida com sucesso."),
            @ApiResponse(responseCode = "500", description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/categoria/{categoriaId}/promocao")
    ResponseEntity<Void> removerPromocaoCategoria(
            @Parameter(description = "LookupId da categoria.") @PathVariable("categoriaId") UUID categoriaId) throws MirlleException;


}
