package com.examen1.order_service.model;

import lombok.Data;

@Data
public class Product {

    private Long id;
    private String nombre;
    private String descripcion;
    private String categoria;
    private Double precio;
    private String codigo;
    private String estado;
}
