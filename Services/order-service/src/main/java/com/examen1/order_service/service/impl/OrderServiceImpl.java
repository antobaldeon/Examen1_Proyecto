package com.examen1.order_service.service.impl;

import com.examen1.order_service.dto.OrderDetailResponse;
import com.examen1.order_service.dto.OrderRequest;
import com.examen1.order_service.dto.OrderResponse;
import com.examen1.order_service.dto.StockUpdateRequest;
import com.examen1.order_service.mapper.OrderMapper;
import com.examen1.order_service.model.*;
import com.examen1.order_service.repository.OrderRepository;
import com.examen1.order_service.service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository repository;
    private final OrderMapper mapper;
    private final ProductLookupService productLookupService;
    private final InventoryLookupService inventoryLookupService;



    @Override
    public OrderResponse create(OrderRequest request) {
        Order order = new Order();
        order.setTipo(request.getTipo());
        order.setFecha(LocalDateTime.now());
        order.setEstado(OrderStatus.PENDIENTE);

        List<OrderDetail> detalles = new ArrayList<>();

        for (var detailRequest : request.getDetalles()) {
            Product product = productLookupService.getProductById(detailRequest.getProductId());

            if (request.getTipo() == OrderType.SALIDA) {
                Inventory inventory = inventoryLookupService.getInventoryByProductId(detailRequest.getProductId());

                if (inventory.getStockActual() < detailRequest.getCantidad()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getNombre());
                }
            }

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProductId(detailRequest.getProductId());
            detail.setCantidad(detailRequest.getCantidad());
            detail.setPrecioUnitario(product.getPrecio());
            double totalDetalle = detailRequest.getCantidad() * product.getPrecio();
            double subtotalDetalle = roundTwoDecimals(totalDetalle / 1.18);
            double igvDetalle = roundTwoDecimals(totalDetalle - subtotalDetalle);

            detail.setSubtotal(subtotalDetalle);
            detail.setIgv(igvDetalle);
            detail.setTotal(roundTwoDecimals(totalDetalle));
            detalles.add(detail);
            StockUpdateRequest stockRequest = new StockUpdateRequest();
            stockRequest.setCantidad(detailRequest.getCantidad());
            stockRequest.setTipo(request.getTipo().name());

            inventoryLookupService.updateInventoryStock(detailRequest.getProductId(), stockRequest);

        }


        order.setDetalles(detalles);

        double subtotal = roundTwoDecimals(detalles.stream()
                .mapToDouble(OrderDetail::getSubtotal)
                .sum());

        double igv = roundTwoDecimals(detalles.stream()
                .mapToDouble(OrderDetail::getIgv)
                .sum());

        double total = roundTwoDecimals(detalles.stream()
                .mapToDouble(OrderDetail::getTotal)
                .sum());

        order.setSubtotal(subtotal);
        order.setIgv(igv);
        order.setTotal(total);
        order.setEstado(OrderStatus.COMPLETADA);

        order = repository.save(order);

        OrderResponse response = mapper.toResponse(order);

        if (response.getDetalles() != null) {
            for (OrderDetailResponse detailResponse : response.getDetalles()) {
                Product product = productLookupService.getProductById(detailResponse.getProductId());
                detailResponse.setProductName(product.getNombre());
            }
        }

        return response;
    }

    @Override
    public List<OrderResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(order -> {
                    OrderResponse response = mapper.toResponse(order);

                    if (response.getDetalles() != null) {
                        for (OrderDetailResponse detailResponse : response.getDetalles()) {
                            Product product = productLookupService.getProductById(detailResponse.getProductId());
                            detailResponse.setProductName(product.getNombre());
                        }
                    }

                    return response;
                })
                .toList();
    }


    @Override
    public OrderResponse getById(Long id) {
        Order order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderResponse response = mapper.toResponse(order);

        if (response.getDetalles() != null) {
            for (OrderDetailResponse detailResponse : response.getDetalles()) {
                Product product = productLookupService.getProductById(detailResponse.getProductId());
                detailResponse.setProductName(product.getNombre());
            }
        }

        return response;
    }
    private double roundTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }


}
