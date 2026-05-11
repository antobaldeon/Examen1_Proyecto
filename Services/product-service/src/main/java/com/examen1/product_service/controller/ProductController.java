package com.examen1.product_service.controller;

import com.examen1.product_service.dto.ProductRequest;
import com.examen1.product_service.dto.ProductResponse;
import com.examen1.product_service.service.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/products")
@Slf4j
public class ProductController {

    private final ProductService service;
    private final DiscoveryClient discoveryClient;

    @Value("${server.port}")
    private String serverPort;

    @Value("${spring.application.name}")
    private String applicationName;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> findAll() {
        logRequest("GET /api/v1/products");
        return ResponseEntity.ok()
                .header("X-Service-Port", serverPort)
                .body(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> findById(@PathVariable Long id) {
        logRequest("GET /api/v1/products/" + id);
        return ResponseEntity.ok()
                .header("X-Service-Port", serverPort)
                .body(service.getById(id));
    }

    @GetMapping("/instance")
    public ResponseEntity<Map<String, Object>> instance() {
        logRequest("GET /api/v1/products/instance");
        List<ServiceInstance> instances = discoveryClient.getInstances(applicationName);

        return ResponseEntity.ok()
                .header("X-Service-Port", serverPort)
                .body(Map.of(
                        "service", applicationName,
                        "port", serverPort,
                        "registeredInstances", instances.size()
                ));
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody ProductRequest request) {
        logRequest("POST /api/v1/products");
        ProductResponse response = service.create(request);

        return ResponseEntity.created(
                URI.create("/api/v1/products/" + response.getId())
        ).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id,
                                                  @RequestBody ProductRequest request) {
        logRequest("PUT /api/v1/products/" + id);
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logRequest("DELETE /api/v1/products/" + id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private void logRequest(String endpoint) {
        log.info("Product-service instance on port {} handled {}", serverPort, endpoint);
    }
}
