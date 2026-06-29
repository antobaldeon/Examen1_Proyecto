package com.examen1.payment_service.repository;

import com.examen1.payment_service.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    java.util.Optional<Payment> findByOrderId(Long orderId);
}
