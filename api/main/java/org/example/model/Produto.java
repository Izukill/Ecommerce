package org.example.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    private String descricao;

    @Builder.Default
    @Column(nullable = false)
    private boolean ativo= true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @JsonIgnore
    @OneToMany(mappedBy = "produto", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<VariacaoProduto> variacaoProduto;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime dataCriacao;

}
