package com.examen1.product_service.service.service;

import com.examen1.product_service.dto.PricingRequest;
import com.examen1.product_service.dto.PricingResponse;

import java.util.List;

public interface PricingService {

    PricingResponse create(PricingRequest request);

    PricingResponse getCurrentPrice(Long productId);

    List<PricingResponse> getHistory(Long productId);

    PricingResponse update(Long id, PricingRequest request);

    void delete(Long id);
}
