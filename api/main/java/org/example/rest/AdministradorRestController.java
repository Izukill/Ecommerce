package org.example.rest;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import org.example.exception.MirlleException;
import org.example.mapper.AdministradorMapper;
import org.example.model.Administrador;
import org.example.rest.dto.*;
import org.example.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<AdministradorResponseDTO> criar(@RequestBody @Valid AdministradorSalvarRequestDTO dto) throws Exception {
        Administrador admin = mapper.from(dto);
        Administrador adminSalvo = service.criar(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.from(adminSalvo));
    }

    @Override
    public ResponseEntity<AdministradorResponseDTO> atualizar(UUID lookupId, AdministradorSalvarRequestDTO dto) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<Void> remover(UUID lookupId) throws MirlleException {
        return null;
    }

    @Override
    @GetMapping("/{lookupId}")
    public ResponseEntity<AdministradorResponseDTO> recuperarPor(@PathVariable UUID lookupId) throws Exception {
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
    public ResponseEntity<Page<ClienteResponseDTO>> buscar(ClienteBuscarDTO dto) throws MirlleException {
        return null;
    }


}
