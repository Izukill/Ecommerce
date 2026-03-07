package org.example.rest;

import jakarta.validation.Valid;
import org.example.model.Cliente;
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

import java.util.UUID;

@RestController
@RequestMapping("/clientes")
public class ClienteRestController implements ClienteRestControllerAPI {

    @Autowired
    private ClienteService service;

    @Autowired
    private ClienteMapper mapper;


    @Override
    public ResponseEntity<ClienteResponseDTO> adicionar(ClienteSalvarRequestDTO dto) throws Exception {
        return null;
    }

    @Override
    public ResponseEntity<ClienteResponseDTO> recuperarPor(UUID lookupId) throws Exception {
        return null;
    }

    @Override
    public ResponseEntity<Page<ClienteResponseDTO>> buscar(ClienteBuscarDTO dto) throws Exception {
        return null;
    }
}