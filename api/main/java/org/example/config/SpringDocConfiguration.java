package org.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SpringDocConfiguration {

    @Bean
    OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MirlleFitness API")
                        .description("API REST para Ecommerce da loja MirlleFitness")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Luan Loreto")
                                .url("https://github.com/Izukill/Ecommerce")
                                .email("luanloreto639@gmail.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://www.apache.org/licenses/LICENSE-2.0")));
    }
}