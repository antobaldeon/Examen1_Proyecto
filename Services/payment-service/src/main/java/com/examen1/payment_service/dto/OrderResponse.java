package com.examen1.payment_service.dto;

import lombok.Data;

@Data
public class OrderResponse {
    private Long id;
    private String codigo;
    private String estado;
    private Double subtotal;
    private Double igv;
    private Double total;
}