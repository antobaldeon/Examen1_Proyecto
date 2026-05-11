package com.examen1.inventory_service.dto;

import lombok.Data;

@Data
public class StockUpdateRequest {

    private Integer cantidad;
    private String tipo;

}
