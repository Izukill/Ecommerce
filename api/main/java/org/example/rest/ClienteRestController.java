package org.example.rest;

import org.example.exception.EntidadeNaoEncontradaException;
import org.example.exception.MirlleException;
import org.example.mapper.ClienteMapper; // Ajuste para o seu pacote
import org.example.model.Cliente;
import org.example.rest.dto.Autenticacao.AlterarSenhaSalvarRequestDTO;
import org.example.rest.dto.Cliente.ClienteBuscarDTO;
import org.example.rest.dto.Cliente.ClienteResponseDTO;
import org.example.rest.dto.Cliente.ClienteSalvarRequestDTO;
import org.example.service.ClienteService;
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
    @PostMapping
    public ResponseEntity<ClienteResponseDTO> criar(@RequestBody ClienteSalvarRequestDTO dto) throws MirlleException {
        Cliente cliente = mapper.from(dto);
        Cliente clienteSalvo = service.criar(cliente);

        // Retornando 201 Created como boa prática
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.from(clienteSalvo));
    }

    // Criamos uma rota específica para alterar a senha
    @Override
    @PutMapping("/{lookupId}/senha")
    public ResponseEntity<Void> alterarSenha(@PathVariable UUID lookupId, @RequestBody AlterarSenhaSalvarRequestDTO dto) throws MirlleException, EntidadeNaoEncontradaException {
        service.alterarSenha(lookupId, dto);
        return ResponseEntity.noContent().build();
    }

    @Override
    @GetMapping("/{lookupId}")
    public ResponseEntity<ClienteResponseDTO> recuperarPor(@PathVariable UUID lookupId) throws MirlleException, EntidadeNaoEncontradaException {
        Cliente cliente = service.recuperarPor(lookupId);
        return ResponseEntity.ok(mapper.from(cliente));
    }

    @Override
    @PutMapping("/{lookupId}")
    public ResponseEntity<ClienteResponseDTO> atualizar(@PathVariable UUID lookupId, @RequestBody ClienteSalvarRequestDTO dto) throws MirlleException, EntidadeNaoEncontradaException {
        Cliente clienteNovosDados = mapper.from(dto);
        Cliente clienteAtualizado = service.atualizar(lookupId, clienteNovosDados);
        return ResponseEntity.ok(mapper.from(clienteAtualizado));
    }

    @Override
    @DeleteMapping("/{lookupId}")
    public ResponseEntity<Void> remover(@PathVariable UUID lookupId) throws MirlleException, EntidadeNaoEncontradaException {
        service.remover(lookupId);
        return ResponseEntity.noContent().build();
    }


    @Override
    @GetMapping
    public ResponseEntity<Page<ClienteResponseDTO>> buscar(ClienteBuscarDTO dto) throws MirlleException {
        Page<Cliente> pagina = service.buscar(dto);
        return ResponseEntity.ok(pagina.map(mapper::from));
    }
}