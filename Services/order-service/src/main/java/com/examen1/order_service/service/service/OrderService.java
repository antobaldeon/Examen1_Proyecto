package com.examen1.order_service.service.service;

import com.examen1.order_service.dto.OrderRequest;
import com.examen1.order_service.dto.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse create(OrderRequest request);

    List<OrderResponse> getAll();

    OrderResponse getById(Long id);
}
