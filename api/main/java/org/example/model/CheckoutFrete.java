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
@Table(name = "Checkout")
public class CheckoutFrete {

    @Id
    private Long id = 1L; //começa com 1 por que só terá uma referência

    @Column(nullable = false)
    private UUID lookupId;

    @PrePersist
    private void init() {
        this.lookupId = UUID.randomUUID();
    }

    @Column(nullable = false)
    private BigDecimal frete = new BigDecimal("35.00");

}
