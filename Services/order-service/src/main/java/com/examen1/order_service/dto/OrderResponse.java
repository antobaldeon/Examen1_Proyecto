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
        "tipo",
        "fecha",
        "estado",
        "subtotal",
        "igv",
        "total",
        "detalles"
})
public class OrderResponse {

    private Long id;
    private OrderType tipo;
    private LocalDateTime fecha;
    private OrderStatus estado;
    private Double subtotal;
    private Double igv;
    private Double total;
    private List<OrderDetailResponse> detalles;
}
