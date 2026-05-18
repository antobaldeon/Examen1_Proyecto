package com.examen1.order_service.dto;

import lombok.Data;

@Data
public class OrderDetailResponse {

    private Long id;
    private Long productId;
    private String productName;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
    private Double igv;
    private Double total;
}
