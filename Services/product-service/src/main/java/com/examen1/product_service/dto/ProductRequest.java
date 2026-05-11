package com.examen1.product_service.dto;

import lombok.Data;

@Data
public class ProductRequest {

    private String nombre;
    private String descripcion;
    private String categoria;
    private Double precio;
    private String codigo;
    private String estado;
}
