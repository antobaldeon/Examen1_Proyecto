package com.examen1.product_service.dto;

import lombok.Data;

@Data
public class CategoriaResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private String estado;
}
