package org.example.rest;

import jakarta.validation.Valid;
import org.example.exception.RegraNegocioException;
import org.example.model.Pessoa;
import org.example.rest.dto.Autenticacao.AutenticacaoRequestDTO;
import org.example.rest.dto.Autenticacao.GoogleTokenDTO;
import org.example.rest.dto.Autenticacao.TokenResponseDTO;
import org.example.rest.dto.Email.ValidarEmailRequestDTO;
import org.example.security.TokenService;
import org.example.service.AutenticacaoGoogleService;
import org.example.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/login")
public class AutenticacaoRestController implements AutenticacaoRestControllerAPI {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private AutenticacaoGoogleService autenticacaoGoogleService;

    @Override
    @PostMapping
    public ResponseEntity<TokenResponseDTO> efetuarLogin(@RequestBody @Valid AutenticacaoRequestDTO dados) {

        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.getEmail(), dados.getSenha());

        Authentication authentication = manager.authenticate(authenticationToken);

        var tokenJWT = tokenService.gerarToken((Pessoa) authentication.getPrincipal());

        return ResponseEntity.ok(new TokenResponseDTO(tokenJWT));


    }

    @PostMapping("/google")
    public ResponseEntity<TokenResponseDTO> loginComGoogle(@RequestBody GoogleTokenDTO dto) throws RegraNegocioException {
        // Envia o token para o Service fazer a mágica
        String nossoTokenJwt = autenticacaoGoogleService.processarLoginGoogle(dto.getToken());
        return ResponseEntity.ok(new TokenResponseDTO(nossoTokenJwt));
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<String> solicitarRecuperacao(@RequestBody Map<String, String> body) {
        try {
            clienteService.solicitarRecuperacaoSenha(body.get("email"));
            return ResponseEntity.ok("Código enviado para o e-mail.");
        } catch (Exception e) {
            //retorna 400 mas não diz exatamente qual foi o erro por segurança
            //(evita que hackers fiquem testando quais e-mails existem no banco)
            return ResponseEntity.badRequest().body("Se o e-mail existir, um código será enviado.");
        }
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<String> redefinirSenha(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String codigo = body.get("codigo");
            String novaSenha = body.get("novaSenha");

            clienteService.redefinirSenhaComCodigo(email, codigo, novaSenha);
            return ResponseEntity.ok("Senha redefinida com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/validar-codigo")
    public ResponseEntity<String> validarCodigo(@RequestBody @Valid ValidarEmailRequestDTO dados) {
        try {
            clienteService.validarCodigo(dados.getEmail(), dados.getCodigo());
            return ResponseEntity.ok("Conta ativada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reenviar-codigo")
    public ResponseEntity<String> reenviarCodigo(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            clienteService.reenviarCodigo(email);
            return ResponseEntity.ok("Novo código enviado para o e-mail.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}