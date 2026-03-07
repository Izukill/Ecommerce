package org.example.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.rest.dto.ClienteBuscarDTO;
import org.example.rest.dto.ClienteResponseDTO;
import org.example.rest.dto.ClienteSalvarRequestDTO;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

@Tag(name = "Clientes", description = "Gerenciamento de contas de clientes da loja")
public interface ClienteRestControllerAPI {

    @Operation(summary = "Criar uma nova conta de Cliente.",
            description = "Cadastra um novo cliente na loja. A senha enviada será criptografada antes de ser salva no banco de dados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201",
                    description = "Cliente cadastrado com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ClienteResponseDTO.class))),
            @ApiResponse(responseCode = "400",
                    description = "Erro de validação nos dados enviados (ex: e-mail já cadastrado).",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<ClienteResponseDTO> adicionar(
            @RequestBody(description = "Dados do cliente a ser cadastrado.") ClienteSalvarRequestDTO dto) throws Exception;

    @Operation(summary = "Recuperar os dados de um cliente.",
            description = "Busca as informações públicas de um cliente através do seu lookupId.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ClienteResponseDTO.class))),
            @ApiResponse(responseCode = "404",
                    description = "Cliente não encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class)))
    })
    ResponseEntity<ClienteResponseDTO> recuperarPor(
            @Parameter(description = "Identificador lookupId do cliente.") UUID lookupId) throws Exception;

    @Operation(summary = "Listar clientes paginados.",
            description = "Retorna uma lista paginada de clientes, permitindo filtros por nome, email ou telefone. (Uso restrito para Administradores).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Busca realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class)))
    })
    ResponseEntity<Page<ClienteResponseDTO>> buscar(@ParameterObject ClienteBuscarDTO dto) throws Exception;
}