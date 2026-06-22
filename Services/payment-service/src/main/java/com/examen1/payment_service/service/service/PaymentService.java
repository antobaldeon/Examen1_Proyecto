package com.examen1.payment_service.service.service;

import com.examen1.payment_service.dto.PaymentRequest;
import com.examen1.payment_service.dto.PaymentResponse;

public interface PaymentService {
    PaymentResponse processPayment(PaymentRequest request);
    PaymentResponse getPaymentByOrderId(Long orderId);
}
