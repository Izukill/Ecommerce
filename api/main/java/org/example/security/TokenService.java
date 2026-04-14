package org.example.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.example.model.Administrador;
import org.example.model.EnumPerfil;
import org.example.model.Pessoa;
import org.example.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

@Service
public class TokenService {


    @Value("${api.security.token.secret}")
    private String secret;

    private static final String ISSUER = "API MirlleEcommerce";

    @Autowired
    private AdministradorRepository administradorRepository;

    public String gerarToken(Pessoa pessoa) {
        try {

            //define o algoritmo de criptografia usando o secret
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            if(pessoa.getTipoPerfil() == EnumPerfil.ADM){
                Optional<Administrador> admin = administradorRepository.findByEmail(pessoa.getEmail());
                boolean temPermissaoTotal = admin.isPresent() && admin.get().isPermissaoTotal();

                return JWT.create()
                        .withIssuer(ISSUER)
                        .withSubject(pessoa.getEmail())
                        .withClaim("lookupId", pessoa.getLookupId().toString())
                        .withClaim("perfil", pessoa.getTipoPerfil().name())
                        .withClaim("nome", pessoa.getNome())
                        .withClaim("permissaoTotal", temPermissaoTotal)
                        .withClaim("pedidosPage", admin.get().isPedidosPage())
                        .withClaim("produtosPage", admin.get().isProdutosPage())
                        .withClaim("categoriasPage", admin.get().isCategoriasPage())
                        .withClaim("clientePage", admin.get().isClientePage())
                        .withClaim("relatoriosPage", admin.get().isRelatoriosPage())
                        .withExpiresAt(dataExpiracao())
                        .sign(algoritmo);

            }else return JWT.create()
                    .withIssuer(ISSUER) //quem gerou o token
                    .withSubject(pessoa.getEmail()) // a informação principal que a gente quer guardar (no caso o email)
                    .withClaim("lookupId", pessoa.getLookupId().toString()) // se pode guardar informações extras como o id
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