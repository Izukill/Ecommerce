package org.example.rest;

import org.example.exception.MirlleException;
import org.example.mapper.ProdutoMapper;
import org.example.rest.dto.ProdutoBuscarDTO;
import org.example.rest.dto.ProdutoResponseDTO;
import org.example.rest.dto.ProdutoSalvarRequestDTO;
import org.example.service.ProdutoService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/produtos")
public class ProdutoRestController implements ProdutoRestControllerAPI{

    private ProdutoService service;

    private ProdutoMapper mapper;



    @Override
    public ResponseEntity<List<ProdutoResponseDTO>> listar() throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<ProdutoResponseDTO> adicionar(ProdutoSalvarRequestDTO dto) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<ProdutoResponseDTO> recuperarPor(UUID lookupId) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<ProdutoResponseDTO> atualizar(UUID lookupId, ProdutoSalvarRequestDTO dto) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<Void> remover(UUID lookupId) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<Page<ProdutoResponseDTO>> buscar(ProdutoBuscarDTO dto) throws MirlleException {
        return null;
    }
}
