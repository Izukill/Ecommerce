package org.example.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.rest.dto.AutenticacaoRequestDTO;
import org.example.rest.dto.TokenResponseDTO;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

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
}