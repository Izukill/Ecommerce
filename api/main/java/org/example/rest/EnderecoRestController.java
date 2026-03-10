package org.example.rest;

import org.example.exception.MirlleException;
import org.example.mapper.EnderecoMapper;
import org.example.rest.dto.EnderecoResponseDTO;
import org.example.rest.dto.EnderecoSalvarRequestDTO;
import org.example.service.EnderecoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/enderecos")
public class EnderecoRestController implements EnderecoRestControllerAPI{

    private EnderecoService service;

    private EnderecoMapper mapper;


    @Override
    public ResponseEntity<List<EnderecoResponseDTO>> listar() throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<EnderecoResponseDTO> criar(EnderecoSalvarRequestDTO dto) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<EnderecoResponseDTO> recuperarPor(UUID lookupId) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<EnderecoResponseDTO> atualizar(UUID lookupId, EnderecoSalvarRequestDTO dto) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<Void> remover(UUID lookupId) throws MirlleException {
        return null;
    }

}
