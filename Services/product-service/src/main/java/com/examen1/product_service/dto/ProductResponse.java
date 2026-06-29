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
        "imagenUrl",
        "fechaCreacion"
})
public class ProductResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private String categoria;
    private String codigo;
    private String estado;
    private String imagenUrl;
    private LocalDateTime fechaCreacion;

    private Double precio;
    private String tipoMoneda;
}
