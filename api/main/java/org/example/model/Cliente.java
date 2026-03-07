package org.example.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "Clientes")
public class Cliente extends Pessoa {

    private LocalDate dataCadastro;

    @Column(unique = true)
    private String telefone;

    @OneToMany(mappedBy = "cliente", orphanRemoval = true, cascade = CascadeType.PERSIST)
    private List<Endereco> enderecos;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.PERSIST)
    private List<Pedido> pedidos;



}
