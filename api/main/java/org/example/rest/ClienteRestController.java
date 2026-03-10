package org.example.rest;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import org.example.exception.MirlleException;
import org.example.model.Cliente;
import org.example.rest.dto.AlterarSenhaSalvarRequestDTO;
import org.example.rest.dto.ClienteBuscarDTO;
import org.example.rest.dto.ClienteResponseDTO;
import org.example.rest.dto.ClienteSalvarRequestDTO;
import org.example.service.ClienteService;
import org.example.mapper.ClienteMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clientes")
public class ClienteRestController implements ClienteRestControllerAPI {

    @Autowired
    private ClienteService service;

    @Autowired
    private ClienteMapper mapper;


    @Override
    public ResponseEntity<List<ClienteResponseDTO>> listar() throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<ClienteResponseDTO> criar(ClienteSalvarRequestDTO dto) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<ClienteResponseDTO> recuperarPor(UUID lookupId) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<ClienteResponseDTO> atualizar(UUID lookupId, ClienteSalvarRequestDTO dto) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<Void> remover(UUID lookupId) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<Page<ClienteResponseDTO>> buscar(ClienteBuscarDTO dto) throws MirlleException {
        return null;
    }

    @Override
    @PatchMapping("/{lookupId}/senha")
    public ResponseEntity<Void> alterarSenha(@PathVariable UUID lookupId,@RequestBody @Valid AlterarSenhaSalvarRequestDTO dto) throws Exception {

        service.alterarSenha(lookupId, dto);
        return ResponseEntity.noContent().build();
    }

}