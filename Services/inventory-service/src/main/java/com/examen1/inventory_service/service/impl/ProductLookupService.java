package com.examen1.inventory_service.service.impl;

import com.examen1.inventory_service.client.ProductClient;
import com.examen1.inventory_service.model.Product;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductLookupService {

    private final ProductClient productClient;

    @CircuitBreaker(name = "productService", fallbackMethod = "productFallback")
    @Retry(name = "productService")
    public Product getProductById(Long productId) {
        return productClient.findById(productId);
    }

    private Product productFallback(Long productId, Exception ex) {
        Product product = new Product();
        product.setId(productId);
        product.setNombre("Producto no disponible");
        return product;
    }
}
