package com.examen1.order_service.mapper;


import com.examen1.order_service.dto.OrderResponse;
import com.examen1.order_service.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final OrderDetailMapper detailMapper;

    public OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setTipo(order.getTipo());
        response.setFecha(order.getFecha());
        response.setEstado(order.getEstado());
        response.setTotal(order.getTotal());

        if (order.getDetalles() != null) {
            response.setDetalles(
                    order.getDetalles()
                            .stream()
                            .map(detailMapper::toResponse)
                            .toList()
            );
        }

        return response;
    }
}
