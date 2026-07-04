package com.examen1.payment_service.controller;

import com.examen1.payment_service.dto.PaymentRequest;
import com.examen1.payment_service.dto.PaymentResponse;
import com.examen1.payment_service.service.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService service;

    @PostMapping
    public ResponseEntity<PaymentResponse> process(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(service.processPayment(request));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(service.getPaymentByOrderId(orderId));
    }
}