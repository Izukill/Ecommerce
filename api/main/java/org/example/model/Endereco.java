package org.example.model;


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

    @ManyToOne()
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    private String cep;

    private String rua;

    private String bairro;

    private String numero;

    private String complemento;

    //Essa linha está sujeita a mudanças caso o pagamento seja apenas de um modo
    private boolean pagarNaEntrega;
}
