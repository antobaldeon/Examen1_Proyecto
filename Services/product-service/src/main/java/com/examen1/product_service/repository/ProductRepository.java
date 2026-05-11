package com.examen1.product_service.repository;

import com.examen1.product_service.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByCodigo(String codigo);
    List<Product> findByCategoria(String categoria);
    List<Product> findByEstado(String estado);

}
