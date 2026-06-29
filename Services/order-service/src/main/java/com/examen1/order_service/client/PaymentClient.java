package com.examen1.order_service.client;

import com.examen1.order_service.dto.PaymentRequest;
import com.examen1.order_service.dto.PaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment-service")
public interface PaymentClient {

    @PostMapping("/api/v1/payments")
    PaymentResponse process(@RequestBody PaymentRequest request);
}
