package org.example.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.rest.dto.Autenticacao.AutenticacaoRequestDTO;
import org.example.rest.dto.Autenticacao.TokenResponseDTO;
import org.example.rest.dto.Email.ValidarEmailRequestDTO;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Tag(name = "Autenticação", description = "Gerenciamento de login e emissão de tokens de acesso web")
public interface AutenticacaoRestControllerAPI {

    @Operation(summary = "Fazer login na loja.",
            description = "Recebe as credenciais do usuário (e-mail e senha) e retorna um token JWT para acesso aos endpoints protegidos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Login realizado com sucesso. Token retornado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TokenResponseDTO.class))),
            @ApiResponse(responseCode = "403",
                    description = "Credenciais inválidas (E-mail ou senha incorretos).",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado no servidor.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<TokenResponseDTO> efetuarLogin(
            @RequestBody(description = "Credenciais do usuário para autenticação.") AutenticacaoRequestDTO dados);

    @Operation(summary = "Validar código de verificação de e-mail.",
            description = "Recebe o e-mail e o código de 6 dígitos enviado ao cliente. Se o código for válido e não estiver expirado, a conta é ativada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Código validado e conta ativada com sucesso.",
                    content = @Content(mediaType = "text/plain",
                            schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400",
                    description = "Código incorreto, expirado ou conta já ativada.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "404",
                    description = "E-mail do cliente não encontrado no sistema.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class)))
    })
    ResponseEntity<String> validarCodigo(
            @RequestBody(description = "Objeto contendo o e-mail do cliente e o código numérico de 6 dígitos.") ValidarEmailRequestDTO dados);


    @Operation(summary = "Reenviar código de verificação.",
            description = "Gera um novo código de 6 dígitos e renova o tempo de expiração, enviando-o novamente para o e-mail do cliente inativo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Novo código gerado e enviado com sucesso para o e-mail.",
                    content = @Content(mediaType = "text/plain",
                            schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400",
                    description = "Conta já ativada (não é necessário reenviar código).",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "404",
                    description = "E-mail do cliente não encontrado no sistema.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class)))
    })
    ResponseEntity<String> reenviarCodigo(
            @RequestBody(description = "JSON contendo o e-mail do cliente para o qual o código será reenviado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(example = "{ \"email\": \"cliente@email.com\" }"))) Map<String, String> body);

}