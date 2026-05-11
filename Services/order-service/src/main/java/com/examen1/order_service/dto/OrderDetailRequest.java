package com.examen1.order_service.dto;

import lombok.Data;

@Data
public class OrderDetailRequest {

    private Long productId;
    private Integer cantidad;
}
