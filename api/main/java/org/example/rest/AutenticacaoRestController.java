package org.example.rest;

import jakarta.validation.Valid;
import org.example.model.Pessoa;
import org.example.rest.dto.Autenticacao.AutenticacaoRequestDTO;
import org.example.rest.dto.Autenticacao.TokenResponseDTO;
import org.example.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class AutenticacaoRestController implements AutenticacaoRestControllerAPI {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Override
    @PostMapping
    public ResponseEntity<TokenResponseDTO> efetuarLogin(@RequestBody @Valid AutenticacaoRequestDTO dados) {

        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.getEmail(), dados.getSenha());

        Authentication authentication = manager.authenticate(authenticationToken);

        var tokenJWT = tokenService.gerarToken((Pessoa) authentication.getPrincipal());

        return ResponseEntity.ok(new TokenResponseDTO(tokenJWT));


    }

}