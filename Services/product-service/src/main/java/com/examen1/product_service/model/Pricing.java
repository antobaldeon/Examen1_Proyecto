package com.examen1.product_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "product_prices")

public class Pricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private BigDecimal precio;
    private String tipoMoneda;
    private LocalDateTime inicioPrecio;
    private LocalDateTime finPrecio;


}
