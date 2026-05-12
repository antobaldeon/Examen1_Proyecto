package com.examen1.product_service.mapper;

import com.examen1.product_service.dto.PricingRequest;
import com.examen1.product_service.dto.PricingResponse;
import com.examen1.product_service.model.Pricing;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PricingMapper {

    public Pricing toEntity(PricingRequest request) {
        Pricing pricing = new Pricing();

        pricing.setProductId(request.getProductId());
        pricing.setPrecio(request.getPrecio());
        pricing.setTipoMoneda(
                request.getTipoMoneda() != null ? request.getTipoMoneda() : "PEN"
        );
        pricing.setInicioPrecio(
                request.getIncioPrecio() != null ? request.getIncioPrecio() : LocalDateTime.now()
        );
        pricing.setFinPrecio(request.getFinPrecio());


        return pricing;
    }

    public PricingResponse toResponse(Pricing pricing) {
        return new PricingResponse(
                pricing.getId(),
                pricing.getProductId(),
                pricing.getPrecio(),
                pricing.getTipoMoneda(),
                pricing.getInicioPrecio(),
                pricing.getFinPrecio()
        );
    }

}
