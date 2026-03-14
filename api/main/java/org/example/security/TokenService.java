package org.example.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.example.model.Pessoa;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {


    @Value("${api.security.token.secret}")
    private String secret;

    private static final String ISSUER = "API MirlleEcommerce";

    public String gerarToken(Pessoa pessoa) {
        try {

            //define o algoritmo de criptografia usando o secret
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer(ISSUER) //quem gerou o token
                    .withSubject(pessoa.getEmail()) // a informação principal que a gente quer guardar (no caso o email)
                    .withClaim("id", pessoa.getId()) // se pode guardar informações extras como o id
                    .withClaim("perfil", pessoa.getTipoPerfil().name()) //guarda se é cliente ou admin
                    .withClaim("nome", pessoa.getNome())
                    .withExpiresAt(dataExpiracao()) //define a expiração
                    .sign(algoritmo); //finaliza

        } catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public String validarToken(String tokenJWT) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            return JWT.require(algoritmo)
                    .withIssuer(ISSUER)
                    .build()
                    .verify(tokenJWT) //verifica se a assinatura é válida e se não expirou
                    .getSubject(); //caso tiver tudo de boa devolve o email do usuário

        } catch (JWTVerificationException exception){
            //se o token for inválido, alterado ou expirado, cai aqui.
            return "Token expirado ou inválido";
        }
    }

    //metodo auxiliar pra alocar o tempo de expiração do token pra n ficar infinito
    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}