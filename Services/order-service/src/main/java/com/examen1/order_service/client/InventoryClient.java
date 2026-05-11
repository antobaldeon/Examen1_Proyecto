package com.examen1.order_service.client;

import com.examen1.order_service.dto.StockUpdateRequest;
import com.examen1.order_service.model.Inventory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "inventory-service")
public interface InventoryClient {

    @GetMapping("/api/v1/inventory/product/{productId}")
    Inventory findByProductId(@PathVariable("productId") Long productId);

    @PutMapping("/api/v1/inventory/product/{productId}/stock")
    Inventory updateStock(@PathVariable("productId") Long productId,
                          @RequestBody StockUpdateRequest request);

}
