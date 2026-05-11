package com.examen1.order_service.controller;

import com.examen1.order_service.dto.OrderRequest;
import com.examen1.order_service.dto.OrderResponse;
import com.examen1.order_service.service.service.OrderService;
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

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody OrderRequest request) {
        OrderResponse response = service.create(request);

        return ResponseEntity.created(
                URI.create("/api/v1/orders/" + response.getId())
        ).build();
    }


}
