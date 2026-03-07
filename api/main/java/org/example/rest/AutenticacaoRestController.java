package org.example.rest;

import jakarta.validation.Valid;
import org.example.model.Pessoa;
import org.example.rest.dto.AutenticacaoRequestDTO;
import org.example.rest.dto.TokenResponseDTO;
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
public class AutenticacaoRestController {

    //classe do spring security que vai no banco e checa se as credenciais batem
    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity<TokenResponseDTO> efetuarLogin(@RequestBody @Valid AutenticacaoRequestDTO dados) {

        // 1. Transforma o DTO em um formato que o Spring Security entende
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.getEmail(), dados.getSenha());

        // 2. Chama o Spring Security para validar. Se a senha estiver errada, ele trava aqui e lança exceção (Erro 403)
        Authentication authentication = manager.authenticate(authenticationToken);

        // 3. Se a senha estiver certa, pegamos o usuário (Pessoa) logado e geramos o JWT
        var tokenJWT = tokenService.gerarToken((Pessoa) authentication.getPrincipal());

        // 4. Devolvemos o token na resposta com status 200 OK
        return ResponseEntity.ok(new TokenResponseDTO(tokenJWT));
    }
}