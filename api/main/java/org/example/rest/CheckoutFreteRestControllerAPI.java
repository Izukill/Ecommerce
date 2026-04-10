package org.example.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.exception.MirlleException;
import org.example.rest.dto.Checkout.CheckoutFreteResponseDTO;
import org.example.rest.dto.Checkout.CheckoutFreteSalvarResquestDTO;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

@Tag(name = "Configurações da Loja", description = "Gerenciamento de parâmetros globais do sistema, como frete.")
public interface CheckoutFreteRestControllerAPI {

    @Operation(summary = "Recuperar as configurações da loja.",
            description = "Retorna os parâmetros de configuração atuais, incluindo o valor do frete fixo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CheckoutFreteResponseDTO.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<CheckoutFreteResponseDTO> obterConfiguracao() throws MirlleException;

    @Operation(summary = "Atualizar o frete fixo.",
            description = "Atualiza o valor do frete fixo que será cobrado nos novos pedidos do e-commerce.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CheckoutFreteResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Erro de validação (ex: valor negativo).",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<CheckoutFreteResponseDTO> atualizarFrete(
            @RequestBody(description = "Novo valor do frete fixo.")
            CheckoutFreteSalvarResquestDTO dto) throws MirlleException;

}