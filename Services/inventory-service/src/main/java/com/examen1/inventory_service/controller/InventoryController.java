package com.examen1.inventory_service.controller;

import com.examen1.inventory_service.dto.InventoryRequest;
import com.examen1.inventory_service.dto.InventoryResponse;
import com.examen1.inventory_service.dto.StockUpdateRequest;
import com.examen1.inventory_service.service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/inventory")
public class InventoryController {

    private final InventoryService service;

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> findAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<InventoryResponse> findByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(service.getByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody InventoryRequest request) {
        InventoryResponse response = service.create(request);

        return ResponseEntity.created(
                URI.create("/api/v1/inventory/" + response.getId())
        ).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponse> update(@PathVariable Long id,
                                                    @RequestBody InventoryRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/product/{productId}/stock")
    public ResponseEntity<InventoryResponse> updateStock(@PathVariable Long productId,
                                                         @RequestBody StockUpdateRequest request) {
        return ResponseEntity.ok(service.updateStock(productId, request));
    }


}
