package com.examen1.order_service.dto;

import com.examen1.order_service.model.OrderType;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private OrderType tipo;
    private List<OrderDetailRequest> detalles;
}
