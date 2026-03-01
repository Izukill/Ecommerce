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
@Table(name = "VariacaoProdutos")
public class VariacaoProduto {

    @Id
    private Long id;

    @Column(nullable = false)
    private UUID lookupId;

    @PrePersist
    private void init() {
        this.lookupId = UUID.randomUUID();
    }

    @ManyToOne()
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @Enumerated(EnumType.STRING)
    private EnumTamanho tamanho;

    private Integer quantidadeEstoque;


}
