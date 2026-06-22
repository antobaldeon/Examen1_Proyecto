package com.examen1.order_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentResponse {

    private Long id;
    private Long orderId;
    private Double monto;
    private String nombreCompleto;
    private String correoElectronico;
    private LocalDateTime fechaPago;
    private String estado;
}
