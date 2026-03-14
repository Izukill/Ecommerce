package org.example.rest;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.example.exception.EntidadeNaoEncontradaException;
import org.example.exception.MirlleException;
import org.example.mapper.CategoriaMapper;
import org.example.model.Categoria;
import org.example.rest.dto.Categoria.CategoriaBuscarDTO;
import org.example.rest.dto.Categoria.CategoriaReponseDTO;
import org.example.rest.dto.Categoria.CategoriaSalvarRequestDTO;
import org.example.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/categorias")
public class CategoriaRestController implements CategoriaRestControllerAPI {

    @Autowired
    private CategoriaService service;

    @Autowired
    private CategoriaMapper mapper;

    @Override
    @PostMapping
    public ResponseEntity<CategoriaReponseDTO> criar(@RequestBody CategoriaSalvarRequestDTO dto) throws MirlleException {

        Categoria categoria = mapper.from(dto);
        Categoria categoriaSalva = service.criar(categoria);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.from(categoriaSalva));
    }

    @Override
    @GetMapping("/{lookupId}")
    public ResponseEntity<CategoriaReponseDTO> recuperarPor(@PathVariable UUID lookupId) throws MirlleException, EntidadeNaoEncontradaException {

        Categoria categoria = service.recuperarPor(lookupId);
        return ResponseEntity.ok(mapper.from(categoria));

    }

    @Override
    @PutMapping("/{lookupId}")
    public ResponseEntity<CategoriaReponseDTO> atualizar(@PathVariable UUID lookupId, @RequestBody CategoriaSalvarRequestDTO dto) throws MirlleException, EntidadeNaoEncontradaException {

        Categoria categoriaNovosDados = mapper.from(dto);
        Categoria categoriaAtualizada = service.atualizar(lookupId, categoriaNovosDados);

        return ResponseEntity.ok(mapper.from(categoriaAtualizada));
    }

    @Override
    @DeleteMapping("/{lookupId}")
    public ResponseEntity<Void> remover(@PathVariable UUID lookupId) throws MirlleException, EntidadeNaoEncontradaException {

        service.remover(lookupId);
        return ResponseEntity.noContent().build();

    }

    @Override
    @GetMapping
    public ResponseEntity<Page<CategoriaReponseDTO>> buscar(CategoriaBuscarDTO dto, Pageable pageable) throws MirlleException {

        Page<Categoria> pagina = service.buscar(dto, pageable);
        return ResponseEntity.ok(pagina.map(mapper::from));

    }
}
