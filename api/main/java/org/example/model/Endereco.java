package org.example.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Enderecos")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID lookupId;

    @PrePersist
    private void init() {
        this.lookupId = UUID.randomUUID();
    }

    @JsonIgnore
    @ManyToOne()
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    private String cep;

    private String rua;

    private String bairro;

    private Integer numero;

    private String complemento;

    private String cidade;

    private String estado;

    private Boolean ativo= true;


}
