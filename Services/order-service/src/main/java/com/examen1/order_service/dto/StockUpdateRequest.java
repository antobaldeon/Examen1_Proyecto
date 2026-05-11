package com.examen1.order_service.dto;

import lombok.Data;

@Data
public class StockUpdateRequest {

    private Integer cantidad;
    private String tipo;
}
