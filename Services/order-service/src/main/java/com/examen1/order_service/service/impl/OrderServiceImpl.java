package com.examen1.order_service.service.impl;

import com.examen1.order_service.dto.OrderDetailResponse;
import com.examen1.order_service.dto.OrderRequest;
import com.examen1.order_service.dto.OrderResponse;
import com.examen1.order_service.dto.StockUpdateRequest;
import com.examen1.order_service.mapper.OrderMapper;
import com.examen1.order_service.model.Inventory;
import com.examen1.order_service.model.Order;
import com.examen1.order_service.model.OrderDetail;
import com.examen1.order_service.model.OrderStatus;
import com.examen1.order_service.model.OrderType;
import com.examen1.order_service.model.Product;
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

    private static final String ORDER_CODE_PREFIX = "ORD-";

    private final OrderRepository repository;
    private final OrderMapper mapper;
    private final ProductLookupService productLookupService;
    private final InventoryLookupService inventoryLookupService;

    @Override
    @Transactional
    public OrderResponse create(OrderRequest request) {
        if (request.getDetalles() == null || request.getDetalles().isEmpty()) {
            throw new RuntimeException("La orden debe tener al menos un producto.");
        }

        Order order = new Order();

        order.setCodigo(generateNextCode());
        order.setTipo(request.getTipo());
        order.setFecha(LocalDateTime.now());
        order.setEstado(OrderStatus.PENDIENTE);
        order.setUsuarioId(request.getUsuarioId());
        order.setUsuarioNombre(request.getUsuarioNombre());
        order.setUsuarioEmail(request.getUsuarioEmail());

        List<OrderDetail> detalles = new ArrayList<>();
        Map<Long, String> productNamesMap = new HashMap<>();

        for (var detailRequest : request.getDetalles()) {
            Product product = productLookupService.getProductById(detailRequest.getProductId());
            productNamesMap.put(detailRequest.getProductId(), product.getNombre());

            if (request.getTipo() == OrderType.SALIDA) {
                Inventory inventory = inventoryLookupService.getInventoryByProductId(
                        detailRequest.getProductId()
                );

                if (inventory.getStockActual() < detailRequest.getCantidad()) {
                    throw new RuntimeException(
                            "Stock insuficiente para el producto: " + product.getNombre()
                    );
                }
            }

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProductId(detailRequest.getProductId());
            detail.setCantidad(detailRequest.getCantidad());
            detail.setPrecioUnitario(product.getPrecio());

            double subtotalDetalle = roundTwoDecimals(
                    detailRequest.getCantidad() * product.getPrecio()
            );

            detail.setSubtotal(subtotalDetalle);
            detalles.add(detail);
        }

        order.setDetalles(detalles);

        double subtotalGlobal = roundTwoDecimals(
                detalles.stream()
                        .mapToDouble(OrderDetail::getSubtotal)
                        .sum()
        );

        double igvGlobal = roundTwoDecimals(subtotalGlobal * 0.18);
        double totalGlobal = roundTwoDecimals(subtotalGlobal + igvGlobal);

        order.setSubtotal(subtotalGlobal);
        order.setIgv(igvGlobal);
        order.setTotal(totalGlobal);

        order = repository.save(order);

        OrderResponse response = mapper.toResponse(order);

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
                .map(this::toResponseWithProducts)
                .toList();
    }

    @Override
    public OrderResponse getById(Long id) {
        Order order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada."));

        return toResponseWithProducts(order);
    }

    @Override
    @Transactional
    public void updateStatus(Long id, OrderStatus status) {
        Order order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada."));

        if (order.getEstado() == OrderStatus.CANCELADA) {
            throw new RuntimeException("No se puede actualizar una orden cancelada.");
        }

        if (status == OrderStatus.PAGADA && order.getEstado() != OrderStatus.PAGADA) {
            descontarStockDeOrden(order);
        }

        order.setEstado(status);
        repository.save(order);
    }

    private void descontarStockDeOrden(Order order) {
        if (order.getTipo() != OrderType.SALIDA) {
            return;
        }

        for (OrderDetail detail : order.getDetalles()) {
            Inventory inventory = inventoryLookupService.getInventoryByProductId(detail.getProductId());

            if (inventory.getStockActual() < detail.getCantidad()) {
                Product product = productLookupService.getProductById(detail.getProductId());
                throw new RuntimeException(
                        "Stock insuficiente para confirmar el pago del producto: " + product.getNombre()
                );
            }
        }

        for (OrderDetail detail : order.getDetalles()) {
            StockUpdateRequest stockRequest = new StockUpdateRequest();
            stockRequest.setCantidad(detail.getCantidad());
            stockRequest.setTipo("SALIDA");

            inventoryLookupService.updateInventoryStock(detail.getProductId(), stockRequest);
        }
    }

    private OrderResponse toResponseWithProducts(Order order) {
        OrderResponse response = mapper.toResponse(order);

        if (response.getDetalles() != null) {
            for (OrderDetailResponse detailResponse : response.getDetalles()) {
                Product product = productLookupService.getProductById(detailResponse.getProductId());
                detailResponse.setProductName(product.getNombre());
            }
        }

        return response;
    }

    private String generateNextCode() {
        return repository.findTopByCodigoStartingWithOrderByIdDesc(ORDER_CODE_PREFIX)
                .map(Order::getCodigo)
                .map(this::nextCodeFrom)
                .orElse(ORDER_CODE_PREFIX + "0001");
    }

    private String nextCodeFrom(String currentCode) {
        try {
            int currentNumber = Integer.parseInt(currentCode.replace(ORDER_CODE_PREFIX, ""));
            return ORDER_CODE_PREFIX + String.format("%04d", currentNumber + 1);
        } catch (NumberFormatException ex) {
            return ORDER_CODE_PREFIX + String.format("%04d", repository.count() + 1);
        }
    }

    private double roundTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}