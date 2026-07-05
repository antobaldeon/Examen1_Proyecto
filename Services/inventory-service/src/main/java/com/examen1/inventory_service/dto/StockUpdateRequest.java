package com.examen1.inventory_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class StockUpdateRequest {

    @NotNull(message = "La cantidad es obligatoria.")
    @Positive(message = "La cantidad debe ser mayor a cero.")
    private Integer cantidad;

    @NotBlank(message = "El tipo de movimiento es obligatorio.")
    private String tipo;
}