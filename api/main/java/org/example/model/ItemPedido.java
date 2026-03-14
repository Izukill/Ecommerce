package org.example.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "ItemPedidos")
public class ItemPedido {

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
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne()
    @JoinColumn(name = "variacaoProduto_id")
    private VariacaoProduto produto;

    private Integer quantidade;

    private BigDecimal precoUnitario;



}
