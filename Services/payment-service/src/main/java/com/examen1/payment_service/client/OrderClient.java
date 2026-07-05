package com.examen1.payment_service.client;

import com.examen1.payment_service.dto.OrderResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "order-service", path = "/api/v1/orders")
public interface OrderClient {

    @GetMapping("/{id}")
    OrderResponse findById(@PathVariable("id") Long id);

    @PutMapping("/{id}/status")
    void updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}