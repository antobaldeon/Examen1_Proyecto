package com.examen1.order_service.client;

import com.examen1.order_service.dto.PaymentRequest;
import com.examen1.order_service.dto.PaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "payment-service", path = "/api/v1/payments")
public interface PaymentClient {

    @PostMapping
    PaymentResponse process(PaymentRequest request);
}