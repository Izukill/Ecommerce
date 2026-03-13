package org.example.rest;

import org.example.exception.MirlleException;
import org.example.mapper.EnderecoMapper; // Ajuste para o seu pacote
import org.example.model.Endereco;
import org.example.rest.dto.Endereco.EnderecoResponseDTO;
import org.example.rest.dto.Endereco.EnderecoSalvarRequestDTO;
import org.example.service.EnderecoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/enderecos")
public class EnderecoRestController implements EnderecoRestControllerAPI {

    @Autowired
    private EnderecoService service;

    @Autowired
    private EnderecoMapper mapper;


    @Override
    @GetMapping("/meus-enderecos")
    public ResponseEntity<List<EnderecoResponseDTO>> listar() throws MirlleException {
        List<Endereco> meusEnderecos = service.listar();

        List<EnderecoResponseDTO> dtos = meusEnderecos.stream()
                .map(mapper::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }


    @Override
    @PostMapping
    public ResponseEntity<EnderecoResponseDTO> criar(@RequestBody EnderecoSalvarRequestDTO dto) throws MirlleException {
        Endereco endereco = mapper.from(dto);
        Endereco enderecoSalvo = service.criar(endereco);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.from(enderecoSalvo));
    }


    @Override
    @GetMapping("/{lookupId}")
    public ResponseEntity<EnderecoResponseDTO> recuperarPor(@PathVariable UUID lookupId) throws MirlleException {
        Endereco endereco = service.recuperarPor(lookupId);
        return ResponseEntity.ok(mapper.from(endereco));
    }


    @Override
    @PutMapping("/{lookupId}")
    public ResponseEntity<EnderecoResponseDTO> atualizar(@PathVariable UUID lookupId, @RequestBody EnderecoSalvarRequestDTO dto) throws MirlleException {
        Endereco novosDados = mapper.from(dto);
        Endereco enderecoAtualizado = service.atualizar(lookupId, novosDados);
        return ResponseEntity.ok(mapper.from(enderecoAtualizado));
    }


    @Override
    @DeleteMapping("/{lookupId}")
    public ResponseEntity<Void> remover(@PathVariable UUID lookupId) throws MirlleException {
        service.remover(lookupId);
        return ResponseEntity.noContent().build();
    }


    @Override
    @GetMapping
    public ResponseEntity<Page<EnderecoResponseDTO>> buscar(Pageable pageable) throws MirlleException {
        Page<Endereco> pagina = service.buscar(pageable);
        return ResponseEntity.ok(pagina.map(mapper::from));
    }
}