package org.example.rest;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import org.example.exception.EntidadeNaoEncontradaException;
import org.example.exception.MirlleException;
import org.example.exception.RegraNegocioException;
import org.example.mapper.AdministradorMapper;
import org.example.model.Administrador;
import org.example.rest.dto.Administrador.AdministradorBuscarDTO;
import org.example.rest.dto.Administrador.AdministradorResponseDTO;
import org.example.rest.dto.Administrador.AdministradorSalvarRequestDTO;
import org.example.rest.dto.Autenticacao.AlterarSenhaSalvarRequestDTO;
import org.example.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdministradorRestController implements AdministradorRestControllerAPI {


    @Autowired
    private AdministradorService service;

    @Autowired
    private AdministradorMapper mapper;

    @Override
    @PostMapping
    public ResponseEntity<AdministradorResponseDTO> criar(@RequestBody @Valid AdministradorSalvarRequestDTO dto) throws RegraNegocioException {
        Administrador admin = mapper.from(dto);
        Administrador adminSalvo = service.criar(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.from(adminSalvo));
    }

    @Override
    @PutMapping("/{lookupId}")
    public ResponseEntity<AdministradorResponseDTO> atualizar(UUID lookupId, AdministradorSalvarRequestDTO dto) throws MirlleException, EntidadeNaoEncontradaException {
        Administrador adminNovosDados = mapper.from(dto);
        Administrador adminAtualizado = service.atualizar(lookupId, adminNovosDados);
        return ResponseEntity.ok(mapper.from(adminAtualizado));
    }

    @Override
    @DeleteMapping("/{lookupId}")
    public ResponseEntity<Void> remover(UUID lookupId) throws MirlleException, EntidadeNaoEncontradaException {
        service.remover(lookupId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @GetMapping("/{lookupId}")
    public ResponseEntity<AdministradorResponseDTO> recuperarPor(@PathVariable UUID lookupId) throws EntidadeNaoEncontradaException {
        Administrador admin = service.recuperarPor(lookupId);
        return ResponseEntity.ok(mapper.from(admin));
    }

    @Override
    @PatchMapping("/{lookupId}/senha")
    public ResponseEntity<Void> alterarSenha(@PathVariable UUID lookupId,@RequestBody @Valid AlterarSenhaSalvarRequestDTO dto) throws Exception {

        service.alterarSenha(lookupId, dto);
        return ResponseEntity.noContent().build();
    }

    @Override
    @GetMapping
    public ResponseEntity<Page<AdministradorResponseDTO>> buscar(AdministradorBuscarDTO dto, Pageable pageable) throws MirlleException {
        Page<Administrador> pagina = service.buscar(dto, pageable);
        return ResponseEntity.ok(pagina.map(mapper::from));
    }


}
