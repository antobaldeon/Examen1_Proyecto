package com.examen1.payment_service.service.impl;

import com.examen1.payment_service.client.OrderClient;
import com.examen1.payment_service.dto.OrderResponse;
import com.examen1.payment_service.dto.PaymentRequest;
import com.examen1.payment_service.dto.PaymentResponse;
import com.examen1.payment_service.mapper.PaymentMapper;
import com.examen1.payment_service.model.Payment;
import com.examen1.payment_service.repository.PaymentRepository;
import com.examen1.payment_service.service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository repository;
    private final PaymentMapper mapper;
    private final OrderClient orderClient;

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        if (request.getOrderId() == null) {
            throw new RuntimeException("Debe indicar la orden a pagar.");
        }

        OrderResponse order = orderClient.findById(request.getOrderId());

        if (order == null) {
            throw new RuntimeException("Orden no encontrada.");
        }

        if ("PAGADA".equalsIgnoreCase(order.getEstado())) {
            throw new RuntimeException("La orden ya se encuentra pagada.");
        }

        if ("CANCELADA".equalsIgnoreCase(order.getEstado())) {
            throw new RuntimeException("No se puede pagar una orden cancelada.");
        }

        if (request.getNumeroTarjeta() == null || request.getNumeroTarjeta().length() < 16) {
            throw new RuntimeException("Numero de tarjeta invalido para la simulacion.");
        }

        if (request.getNombreCompleto() == null || request.getNombreCompleto().isBlank()) {
            throw new RuntimeException("Debe indicar el nombre completo del titular.");
        }

        Payment payment = new Payment();

        payment.setOrderId(request.getOrderId());
        payment.setMonto(order.getTotal());
        payment.setNombreCompleto(request.getNombreCompleto());
        payment.setNumeroTarjeta(maskCardNumber(request.getNumeroTarjeta()));
        payment.setFechaExpiracion(request.getFechaExpiracion());
        payment.setCodigoSeguridad(request.getCodigoSeguridad());
        payment.setNumeroTelefono(request.getNumeroTelefono());
        payment.setCorreoElectronico(request.getCorreoElectronico());
        payment.setDireccion(request.getDireccion());
        payment.setCiudad(request.getCity());
        payment.setFechaPago(LocalDateTime.now());
        payment.setEstado("EXITOSO");

        payment = repository.save(payment);

        orderClient.updateStatus(request.getOrderId(), "PAGADA");

        return mapper.toResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = repository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("No se encontro ningun pago para la orden: " + orderId));

        return mapper.toResponse(payment);
    }

    private String maskCardNumber(String cardNumber) {
        return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
    }
}