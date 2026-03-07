package org.example.config;

import jakarta.servlet.Filter;
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

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {



        return httpSecurity
                //desabilita proteção contra ataques que não existem em APIs REST com Tokens
                .csrf(csrf -> csrf.disable())

                //avisa ao spring que a api é stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                //definição das regras dos endpoints (o mais importante)
                .authorizeHttpRequests(authorize -> authorize

                        //rotas públicas (qualquer um acessa, sem token)
                        .requestMatchers(HttpMethod.POST, "/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/clientes").permitAll() //criar conta
                        .requestMatchers(HttpMethod.GET, "/produtos/**").permitAll() //ver a vitrine

                        //rotas pra ADM
                        .requestMatchers(HttpMethod.POST, "/produtos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/produtos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/admin").hasRole("ADMIN")

                        //rotas pra CLIENTE
                        .requestMatchers(HttpMethod.POST, "/pedidos/checkout").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.POST, "/enderecos").hasRole("CLIENTE")

                        //qualquer outro endpoint que não foi setado acima faz com que no mínimo precise estar autenticado
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
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