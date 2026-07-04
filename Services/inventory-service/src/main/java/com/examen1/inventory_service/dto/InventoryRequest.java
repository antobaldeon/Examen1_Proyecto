package com.examen1.inventory_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryRequest {

    @NotNull(message = "El producto es obligatorio.")
    private Long productId;
    @NotNull(message = "El stock actual es obligatorio.")
    @Min(value = 0, message = "El stock actual no puede ser negativo.")
    private Integer stockActual;
    @NotNull(message = "El stock minimo es obligatorio.")
    @Min(value = 0, message = "El stock minimo no puede ser negativo.")
    private Integer stockMinimo;
    @NotBlank(message = "La ubicacion es obligatoria.")
    private String ubicacion;
}