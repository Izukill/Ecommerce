package org.example.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Produtos")
public class Produto {

    @Id
    private Long id;

    @Column(nullable = false)
    private UUID lookupId;

    @PrePersist
    private void init() {
        this.lookupId = UUID.randomUUID();
    }

    @Column(nullable = false)
    private String nome;

    private String imagemUrl;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private boolean ativo= true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @OneToMany(mappedBy = "produto", orphanRemoval = true, cascade = CascadeType.PERSIST)
    private List<VariacaoProduto> variacaoProduto;

}
