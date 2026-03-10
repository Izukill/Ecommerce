package org.example.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PessoaRepository pessoaRepository;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //tenta pegar o token do cabeçalho da requisição
        var tokenJWT = recuperarToken(request);

        if (tokenJWT != null) {
            //chama o service para checar se o token é true memo
            var emailDonoDoToken = tokenService.validarToken(tokenJWT);

            //se o token for true da true ele vai retornar o email ou seja não vai ser vazio
            if (!emailDonoDoToken.isEmpty()) {

                var usuarioOptional = pessoaRepository.findByEmail(emailDonoDoToken);

                if (usuarioOptional.isPresent()) {

                    //busca a pessoa no banco usando o email
                    UserDetails usuario = usuarioOptional.get();

                    //cria um objeto de autenticação com as permissões (roles) do usuário
                    var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());

                    //avisa ao spring "tá liberado dog, eu conheço esse cara, ele tá logado"
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        //continua o fluxo normal da requisição (vai para o Controller ou é barrado nas regras)
        filterChain.doFilter(request, response);
    }

    //metodo auxilicar para recuperar o token puro
    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");

        //o padrão web é enviar o token assim: "Bearer dhi213u12839h12..."
        if (authorizationHeader != null) {
            return authorizationHeader.replace("Bearer ", "");
        }
        return null;
    }
}
