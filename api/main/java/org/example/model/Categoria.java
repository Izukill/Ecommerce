package org.example.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Categorias")
public class Categoria {

    @Id
    private Long Id;

    @Column(nullable = false)
    private UUID lookupId;

    @PrePersist
    private void init() {
        if (this.lookupId == null) {
            this.lookupId = UUID.randomUUID();
        }
    }

    @Column(nullable = false, unique = true)
    private String nome;

    private boolean ativo= true;

    @OneToMany(mappedBy = "categoria", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Produto> produtos;






}
