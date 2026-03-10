package org.example.rest;

import java.util.List;
import java.util.UUID;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.exception.MirlleException;
import org.example.rest.dto.*;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Pedidos", description = "Gerenciamento de Pedidos")
@SecurityRequirement(name = "bearerAuth")
public interface PedidoRestControllerAPI {



    @Operation(summary = "Realizar um Checkout (Criar novo Pedido).",
            description = "Cria um novo Pedido com base nos itens do carrinho e endereço de entrega informados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PedidoResponseDTO.class))),

            @ApiResponse(
                    responseCode = "400", description = "Erro ao cadastrar Pedido",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),

            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<PedidoResponseDTO> processarCheckout(@RequestBody(description = "Dados do carrinho de compras e endereço.")
                                                PedidoCheckoutRequestDTO dto) throws MirlleException;

    @Operation(summary = "Recuperar um pedido existente.",
            description = "Recupera um pedido existente com base no seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PedidoResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Pedido com lookupId NÃO encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<PedidoResponseDTO> recuperarPor(@Parameter(description = "LookupId do pedido a ser recuperado.")
                                                   UUID lookupId) throws MirlleException;


    @Operation(summary = "Listar meus pedidos (Visão do Cliente).",
            description = "Recupera o histórico de pedidos do cliente autenticado de forma paginada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class, contentSchema = PedidoResponseDTO.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<Page<PedidoResponseDTO>> listarMeusPedidos(@ParameterObject Pageable pageable) throws MirlleException;

    @Operation(summary = "Listar todos os pedidos (Visão do Admin).",
            description = "Recupera pedidos existentes de forma paginada com base nos seguintes filtros opcionais: (status, cliente, data inicial, data final).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class, contentSchema = PedidoResponseDTO.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<Page<PedidoResponseDTO>> listarPedidosAdmin(@ParameterObject PedidoBuscarDTO dto) throws MirlleException;

}