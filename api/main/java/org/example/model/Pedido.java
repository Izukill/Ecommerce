package org.example.model;

import jakarta.persistence.*;
import lombok.*;

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
@Table(name = "Pedidos")
public class Pedido {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID lookupId;

    @Column(name = "pagamento_mercado_pago_id")
    private Long pagamentoMercadoPagoId;

    @PrePersist
    private void init() {
        this.lookupId = UUID.randomUUID();
    }


    @Enumerated(EnumType.STRING)
    private EnumStatusPedido status;


    private BigDecimal valorTotal;

    @ManyToOne()
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id")
    private Endereco enderecoEntrega;

    @Column(nullable = false)
    private BigDecimal freteFixo;

    private LocalDateTime dataHora;

    @Column(name = "data_expiracao")
    private LocalDateTime dataExpiracao;//pra devolver pro estoque caso não pague o pedido

    @OneToMany(mappedBy = "pedido", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<ItemPedido> itens;

}
