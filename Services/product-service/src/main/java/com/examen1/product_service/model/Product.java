package com.examen1.product_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "product_db")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String descripcion;

    private String categoria;

    private Double precio;

    private String codigo;

    private String estado;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
}
