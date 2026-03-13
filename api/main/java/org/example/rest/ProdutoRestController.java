package org.example.rest;

import org.example.exception.MirlleException;
import org.example.mapper.ProdutoMapper;
import org.example.model.Produto;
import org.example.rest.dto.Produto.ProdutoBuscarDTO;
import org.example.rest.dto.Produto.ProdutoResponseDTO;
import org.example.rest.dto.Produto.ProdutoSalvarRequestDTO;
import org.example.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/produtos")
public class ProdutoRestController implements ProdutoRestControllerAPI{

    @Autowired
    private ProdutoService service;

    @Autowired
    private ProdutoMapper mapper;


    @Override
    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criar(@RequestBody ProdutoSalvarRequestDTO dto) throws MirlleException {

        Produto produto = mapper.from(dto);
        Produto produtoSalvo = service.criar(produto);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.from(produtoSalvo));
    }

    @Override
    @GetMapping("/{lookupId}")
    public ResponseEntity<ProdutoResponseDTO> recuperarPor(@PathVariable UUID lookupId) throws MirlleException {

        Produto produto = service.recuperarPor(lookupId);
        return ResponseEntity.ok(mapper.from(produto));


    }

    @Override
    @PutMapping("/{lookupId}")
    public ResponseEntity<ProdutoResponseDTO> atualizar(@PathVariable UUID lookupId,@RequestBody ProdutoSalvarRequestDTO dto) throws MirlleException {

        Produto produtoNovosDados = mapper.from(dto);
        Produto produtoAtualizado = service.atualizar(lookupId, produtoNovosDados);
        return ResponseEntity.ok(mapper.from(produtoAtualizado));

    }

    @Override
    @DeleteMapping("/{lookupId}")
    public ResponseEntity<Void> remover(@PathVariable UUID lookupId) throws MirlleException {
        service.remover(lookupId);
        return ResponseEntity.noContent().build();

    }

    @Override
    @GetMapping
    public ResponseEntity<Page<ProdutoResponseDTO>> buscar(ProdutoBuscarDTO dto, Pageable pageable) throws MirlleException {
        Page<Produto> pagina = service.buscar(dto, pageable);
        return ResponseEntity.ok(pagina.map(mapper::from));
    }
}
