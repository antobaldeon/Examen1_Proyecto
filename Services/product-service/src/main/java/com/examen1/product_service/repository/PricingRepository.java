package com.examen1.product_service.repository;

import com.examen1.product_service.model.Pricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PricingRepository extends JpaRepository<Pricing, Long> {

    @Query("""
    SELECT p FROM Pricing p
    WHERE p.productId = :productId
    AND p.inicioPrecio <= :now
    AND (p.finPrecio IS NULL OR p.finPrecio > :now)
    ORDER BY p.inicioPrecio DESC
""")
    Optional<Pricing> findCurrentPrice(
            @Param("productId") Long productId,
            @Param("now") LocalDateTime now
    );

    List<Pricing> findByProductIdOrderByInicioPrecioDesc(Long productId);

}
