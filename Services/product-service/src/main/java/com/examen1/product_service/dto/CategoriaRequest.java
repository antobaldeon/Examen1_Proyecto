package com.examen1.product_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoriaRequest {

    @NotBlank(message = "El nombre de la categoria es obligatorio.")
    private String nombre;

    private String descripcion;

    @NotBlank(message = "El estado de la categoria es obligatorio.")
    private String estado;
}
