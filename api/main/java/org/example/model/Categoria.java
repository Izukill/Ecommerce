package org.example.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(nullable = false)
    private UUID lookupId;

    @PrePersist
    private void init() {
        if (this.lookupId == null) {
            this.lookupId = UUID.randomUUID();
        }
    }

    @Column(nullable = false, unique = true, columnDefinition = "VARCHAR(255)")
    private String nome;

    @Builder.Default
    @Column(nullable = false)
    private boolean ativo= true;

    @JsonIgnore
    @OneToMany(mappedBy = "categoria", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Produto> produtos;






}
