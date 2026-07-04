package com.examen1.payment_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotNull(message = "La orden es obligatoria.")
    private Long orderId;

    @NotBlank(message = "El nombre completo es obligatorio.")
    private String nombreCompleto;

    @NotBlank(message = "El numero de tarjeta es obligatorio.")
    private String numeroTarjeta;

    @NotBlank(message = "La fecha de expiracion es obligatoria.")
    private String fechaExpiracion;

    @NotBlank(message = "El codigo de seguridad es obligatorio.")
    private String codigoSeguridad;

    @NotBlank(message = "El numero de telefono es obligatorio.")
    private String numeroTelefono;

    @NotBlank(message = "El correo electronico es obligatorio.")
    @Email(message = "El correo electronico no es valido.")
    private String correoElectronico;

    @NotBlank(message = "La direccion es obligatoria.")
    private String direccion;

    @NotBlank(message = "La ciudad es obligatoria.")
    private String city;
}