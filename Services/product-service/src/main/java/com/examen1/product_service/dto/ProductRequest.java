package com.examen1.product_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class ProductRequest {

    @NotBlank(message = "El nombre del producto es obligatorio.")
    private String nombre;
    @NotBlank(message = "La descripcion del producto es obligatoria.")
    private String descripcion;
    @NotBlank(message = "La categoria del producto es obligatoria.")
    private String categoria;
    @NotNull(message = "El precio es obligatorio.")
    @PositiveOrZero(message = "El precio no puede ser negativo.")
    private Double precio;
    private String codigo;
    @NotBlank(message = "El estado del producto es obligatorio.")
    private String estado;
    private String imagenUrl;
}