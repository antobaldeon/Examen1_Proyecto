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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository repository;
    private final OrderMapper mapper;
    private final ProductLookupService productLookupService;
    private final InventoryLookupService inventoryLookupService;

    @Override
    @Transactional // Evita inconsistencias si la actualización de stock o el guardado de la orden fallan
    public OrderResponse create(OrderRequest request) {
        Order order = new Order();
        order.setTipo(request.getTipo());
        order.setFecha(LocalDateTime.now());
        order.setEstado(OrderStatus.PENDIENTE);

        List<OrderDetail> detalles = new ArrayList<>();
        // Guardamos los nombres de los productos aquí para no volver a llamarlos por HTTP al final
        Map<Long, String> productNamesMap = new HashMap<>();

        for (var detailRequest : request.getDetalles()) {
            Product product = productLookupService.getProductById(detailRequest.getProductId());
            // Almacenamos el nombre en memoria local
            productNamesMap.put(detailRequest.getProductId(), product.getNombre());

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

            double subtotalDetalle = roundTwoDecimals(detailRequest.getCantidad() * product.getPrecio());
            detail.setSubtotal(subtotalDetalle);

            detalles.add(detail);

            // 🚀 RECONEXIÓN DEL STOCK: Descomentado y activado
            StockUpdateRequest stockRequest = new StockUpdateRequest();
            stockRequest.setCantidad(detailRequest.getCantidad());
            stockRequest.setTipo(request.getTipo().name()); // Pasará "SALIDA" o "ENTRADA"

            // Envía la petición HTTP a través de tu servicio proxy/client hacia el ms-inventory
            inventoryLookupService.updateInventoryStock(detailRequest.getProductId(), stockRequest);
        }

        order.setDetalles(detalles);

        double subtotalGlobal = roundTwoDecimals(detalles.stream()
                .mapToDouble(OrderDetail::getSubtotal)
                .sum());

        double igvGlobal = roundTwoDecimals(subtotalGlobal * 0.18);
        double totalGlobal = roundTwoDecimals(subtotalGlobal + igvGlobal);

        order.setSubtotal(subtotalGlobal);
        order.setIgv(igvGlobal);
        order.setTotal(totalGlobal);
        order.setEstado(OrderStatus.COMPLETADA);

        order = repository.save(order);

        OrderResponse response = mapper.toResponse(order);

        // 🚀 OPTIMIZACIÓN CLAVE: Mapeamos los nombres desde memoria (0 peticiones HTTP extras)
        if (response.getDetalles() != null) {
            for (OrderDetailResponse detailResponse : response.getDetalles()) {
                String name = productNamesMap.get(detailResponse.getProductId());
                detailResponse.setProductName(name != null ? name : "Unknown Product");
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

    @Override
    @Transactional
    public void updateStatus(Long id, OrderStatus status) {
        Order order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setEstado(status);
        repository.save(order);
    }
}
