package com.examen1.inventory_service.dto;

import lombok.Data;

@Data
public class InventoryRequest {

    private Long productId;
    private Integer stockActual;
    private Integer stockMinimo;
    private String ubicacion;
}
