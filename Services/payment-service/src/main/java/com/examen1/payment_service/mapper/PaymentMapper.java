package com.examen1.payment_service.mapper;

import com.examen1.payment_service.dto.PaymentResponse;
import com.examen1.payment_service.model.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrderId());
        response.setMonto(payment.getMonto());
        response.setNombreCompleto(payment.getNombreCompleto());
        response.setCorreoElectronico(payment.getCorreoElectronico());
        response.setFechaPago(payment.getFechaPago());
        response.setEstado(payment.getEstado());
        return response;
    }
}
