package com.examen1.order_service.controller;

import com.examen1.order_service.dto.OrderRequest;
import com.examen1.order_service.dto.OrderResponse;
import com.examen1.order_service.model.OrderStatus;
import com.examen1.order_service.service.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService service;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> findAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/user/{usuarioId}")
    public ResponseEntity<List<OrderResponse>> findByUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.getByUsuarioId(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody OrderRequest request) {
        OrderResponse response = service.create(request);

        return ResponseEntity.created(
                URI.create("/api/v1/orders/" + response.getId())
        ).body(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            service.updateStatus(id, orderStatus);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Estado de orden invalido: " + status);
        }
    }
}
