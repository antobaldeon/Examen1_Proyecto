package com.examen1.order_service.service.impl;

import com.examen1.order_service.client.InventoryClient;
import com.examen1.order_service.dto.StockUpdateRequest;
import com.examen1.order_service.model.Inventory;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryLookupService {

    private final InventoryClient inventoryClient;

    @CircuitBreaker(name = "inventoryService", fallbackMethod = "inventoryFallback")
    @Retry(name = "inventoryService")
    public Inventory getInventoryByProductId(Long productId) {
        return inventoryClient.findByProductId(productId);
    }

    @CircuitBreaker(name = "inventoryService", fallbackMethod = "updateInventoryFallback")
    @Retry(name = "inventoryService")
    public void updateInventoryStock(Long productId, StockUpdateRequest request) {
        inventoryClient.updateStock(productId, request);
    }

    private Inventory inventoryFallback(Long productId, Exception ex) {
        throw new RuntimeException("Inventory service unavailable");
    }

    private void updateInventoryFallback(Long productId, StockUpdateRequest request, Exception ex) {
        throw new RuntimeException("Inventory service unavailable");
    }



}
