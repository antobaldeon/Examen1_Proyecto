package com.examen1.product_service.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

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
        "imagenesUrls",
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
    private List<String> imagenesUrls;
    private LocalDateTime fechaCreacion;

    private Double precio;
    private String tipoMoneda;
}
