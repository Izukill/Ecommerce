package org.example.config;

import org.example.security.SecurityFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {



        return httpSecurity

                //diz para o spring utilizar as regras que é definido na função abaixo dessa
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                //desabilita proteção contra ataques que não existem em APIs REST com Tokens
                .csrf(csrf -> csrf.disable())

                //avisa ao spring que a api é stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                //definição das regras dos endpoints (o mais importante)
                .authorizeHttpRequests(authorize -> authorize



                        //rotas públicas (qualquer um acessa, sem token)
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/clientes").permitAll() //criar conta
                        .requestMatchers(HttpMethod.GET, "/produtos/**").permitAll() //ver a vitrine
                        .requestMatchers(HttpMethod.GET, "/categorias/**").permitAll() //ver categorias
                        .requestMatchers("/error").permitAll() //rota de erro liberada para não mascara excessões

                        //rotas pra ADM
                        .requestMatchers(HttpMethod.POST, "/produtos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/produtos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/admin").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/upload/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/categorias").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categorias/**").hasRole("ADMIN")

                        //rotas pra CLIENTE
                        .requestMatchers(HttpMethod.POST, "/pedidos/checkout").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.POST, "/enderecos").hasRole("CLIENTE")

                        //qualquer outro endpoint que não foi setado acima faz com que no mínimo precise estar autenticado por segurança
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        //libera a porta do seu Next.js (mudar depois de colocar ao ar)
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));

        //libera os métodos HTTP que o Front-end vai usar
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));

        //libera todos os cabeçalhos (inclusive o Authorization com o Token)
        configuration.setAllowedHeaders(List.of("*"));

        //permite o envio de credenciais
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        //aplica essa regra para absolutamente todas as rotas da sua API
        source.registerCorsConfiguration("/**", configuration);
        return source;

    }


    //manda o spring injetar o authenticationManager no nosso Controller
    @Bean
    public AuthenticationManager authenticationManager(org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    //fala para o spring que as senhas no banco de dados estão criptografadas usando o algoritmo BCrypt
    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }


}