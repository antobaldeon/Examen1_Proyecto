package com.examen1.order_service.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Inventory {

    private Long id;
    private Long productId;
    private String productName;
    private Integer stockActual;
    private Integer stockMinimo;
    private String ubicacion;
    private String estado;
    private LocalDateTime fechaActualizacion;
}
