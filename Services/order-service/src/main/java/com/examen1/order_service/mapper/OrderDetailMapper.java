package com.examen1.order_service.mapper;

import com.examen1.order_service.dto.OrderDetailResponse;
import com.examen1.order_service.model.OrderDetail;
import org.springframework.stereotype.Component;

@Component
public class OrderDetailMapper {

    public OrderDetailResponse toResponse(OrderDetail detail) {
        OrderDetailResponse response = new OrderDetailResponse();
        response.setId(detail.getId());
        response.setProductId(detail.getProductId());
        response.setCantidad(detail.getCantidad());
        response.setPrecioUnitario(detail.getPrecioUnitario());
        return response;
    }
}
