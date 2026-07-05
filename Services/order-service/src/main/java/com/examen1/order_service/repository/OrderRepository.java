package com.examen1.order_service.repository;

import com.examen1.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findTopByCodigoStartingWithOrderByIdDesc(String prefix);

    List<Order> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
}
