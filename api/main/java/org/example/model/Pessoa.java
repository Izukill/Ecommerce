package org.example.model;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "Pessoas")
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Pessoa implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID lookupId;

    @PrePersist
    private void init() {
        this.lookupId = UUID.randomUUID();
    }


    private String nome;

    @Column(unique = true)
    private String email;

    private String senha;

    @Enumerated(EnumType.STRING)
    private EnumPerfil tipoPerfil;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        //se o perfil for ADM, ele ganha a permissão ROLE_ADMIN.
        //caso não ele ganha a ROLE_CLIENTE (como só tem 2 tipos de usuários)
        if (this.tipoPerfil == EnumPerfil.ADM) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_CLIENTE"));
        }
    }

    @Override
    public String getPassword() {
        return this.senha; //o spring vai usar isso para comparar a senha do banco com a digitada
    }

    @Override
    public String getUsername() {
        return this.email; //o "nome de usuário" no e-commerce é o email mas eu poderia passar um nick unique também
    }

    //os métodos abaixo são para controle de bloqueio de conta
    //como não tenho implementação para isso apenas retorne true para nunca expirar
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }


}
