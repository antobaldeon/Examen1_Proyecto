package com.examen1.order_service.dto;

import com.examen1.order_service.model.OrderType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotNull(message = "El tipo de orden es obligatorio.")
    private OrderType tipo;

    private Long usuarioId;

    private String usuarioNombre;

    @Email(message = "El correo del usuario no es valido.")
    private String usuarioEmail;

    @Valid
    @NotEmpty(message = "La orden debe tener al menos un producto.")
    private List<OrderDetailRequest> detalles;
}