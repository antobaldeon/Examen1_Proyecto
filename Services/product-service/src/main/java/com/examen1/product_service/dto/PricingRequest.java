package com.examen1.product_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PricingRequest {

    private Long productId;

    private BigDecimal precio;
    private String tipoMoneda;
    private LocalDateTime incioPrecio;
    private LocalDateTime finPrecio;
}
