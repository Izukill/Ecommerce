package org.example.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.example.exception.RegraNegocioException;
import org.example.model.Cliente;
import org.example.model.EnumPerfil;
import org.example.repository.ClienteRepository;
import org.example.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AutenticacaoGoogleService {

    @Value("${google.client.id}") // Coloque seu Client ID no application.properties
    private String clientId;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TokenService tokenService;

    public String processarLoginGoogle(String tokenDoGoogle) throws RegraNegocioException {
        try {
            // 1. Configura o verificador oficial do Google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            // 2. Valida o Token
            GoogleIdToken idToken = verifier.verify(tokenDoGoogle);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                // 3. Extrai os dados do usuário
                String email = payload.getEmail();
                String nome = (String) payload.get("name");

                // 4. Verifica se o cliente já existe no banco
                Cliente cliente = clienteRepository.findByEmail(email).orElse(null);

                // 5. Se não existir, cadastra automaticamente!
                if (cliente == null) {
                    cliente = new Cliente();
                    cliente.setEmail(email);
                    cliente.setNome(nome);
                    cliente.setTipoPerfil(EnumPerfil.CLIENTE);
                    // Como o login é via Google, você pode gerar uma senha aleatória complexa 
                    // ou deixar a senha nula (exigindo login social para essa conta).
                    cliente.setSenha("SENHA_GERADA_ALEATORIAMENTE_OU_NULA");
                    clienteRepository.save(cliente);
                }

                // 6. Gera o nosso Token JWT usando o seu TokenService
                return tokenService.gerarToken(cliente);

            } else {
                throw new RegraNegocioException("Token do Google inválido.");
            }
        } catch (Exception e) {
            throw new RegraNegocioException("Erro ao processar autenticação com o Google.");
        }
    }
}