package com.examen1.order_service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class OrderDetailRequest {

    @NotNull(message = "El producto es obligatorio.")
    private Long productId;

    @NotNull(message = "La cantidad es obligatoria.")
    @Positive(message = "La cantidad debe ser mayor a cero.")
    private Integer cantidad;
}