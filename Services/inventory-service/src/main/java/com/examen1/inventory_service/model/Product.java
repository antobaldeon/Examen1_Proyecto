package com.examen1.inventory_service.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Product {

    private Long id;
    private String nombre;
    private String descripcion;
    private String categoria;
    private Double precio;
    private String codigo;
    private String estado;
    private LocalDateTime fechaCreacion;
}
