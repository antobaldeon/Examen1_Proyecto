package com.examen1.payment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "order-service", contextId = "orderServiceClient")
public interface OrderClient {

    @PutMapping("/api/v1/orders/{id}/status")
    void updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}
