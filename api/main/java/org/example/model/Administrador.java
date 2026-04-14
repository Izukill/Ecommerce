package org.example.model;


import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "Administradores")
public class Administrador extends Pessoa {

    @Enumerated(EnumType.STRING)
    private EnumCargo cargo;

    private boolean permissaoTotal;

    private boolean pedidosPage;

    private boolean produtosPage;

    private boolean categoriasPage;

    private boolean clientePage;

    private boolean relatoriosPage;





}
