package com.examen1.order_service.dto;

import com.examen1.order_service.model.OrderStatus;
import com.examen1.order_service.model.OrderType;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonPropertyOrder({
        "id",
        "codigo",
        "tipo",
        "fecha",
        "estado",
        "usuarioId",
        "usuarioNombre",
        "usuarioEmail",
        "subtotal",
        "igv",
        "total",
        "detalles"
})
public class OrderResponse {

    private Long id;

    private String codigo;

    private OrderType tipo;

    private LocalDateTime fecha;

    private OrderStatus estado;

    private Long usuarioId;

    private String usuarioNombre;

    private String usuarioEmail;

    private Double subtotal;

    private Double igv;

    private Double total;

    private List<OrderDetailResponse> detalles;
}