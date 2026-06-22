package com.examen1.payment_service.dto;

import lombok.Data;

@Data
public class PaymentRequest {

    private Long orderId;
    private Double monto;
    private String nombreCompleto;
    private String numeroTarjeta;
    private String fechaExpiracion;
    private String codigoSeguridad;
    private String numeroTelefono;
    private String correoElectronico;
    private String direccion;
    private String city;
}
