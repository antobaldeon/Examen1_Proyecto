package com.examen1.product_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PricingResponse {

    private Long id;
    private Long productId;
    private BigDecimal precio;
    private String tipoMoneda;
    private LocalDateTime incioPrecio;
    private LocalDateTime finPrecio;
}
