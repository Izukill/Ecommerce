package org.example.mock;

import org.example.model.Administrador;
import org.example.model.EnumCargo;
import org.example.model.EnumPerfil;
import org.example.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private PessoaRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (repository.findByEmail("jaqueline@gmail.com").isEmpty()) {


            Administrador adm = Administrador.builder()
                    .nome("Jaqueline Ferreira")
                    .permissaoTotal(true)
                    .email("jaqueline@gmail.com")
                    .tipoPerfil(EnumPerfil.ADM)
                    .cargo(EnumCargo.DONO)
                    .senha(passwordEncoder.encode("batata"))
                    .lookupId(UUID.randomUUID())
                    .build();

            repository.save(adm);

            System.out.println(">>> Admin padrão criado: jaqueline@gmail.com / batata");
        }
    }
}
