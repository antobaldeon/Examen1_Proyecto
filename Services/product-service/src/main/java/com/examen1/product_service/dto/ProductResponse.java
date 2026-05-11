package com.examen1.product_service.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonPropertyOrder({
        "id",
        "nombre",
        "descripcion",
        "categoria",
        "precio",
        "codigo",
        "estado",
        "fechaCreacion"
})
public class ProductResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private String categoria;
    private Double precio;
    private String codigo;
    private String estado;
    private LocalDateTime fechaCreacion;
}
