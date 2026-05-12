package com.examen1.product_service.service.impl;

import com.examen1.product_service.dto.PricingRequest;
import com.examen1.product_service.dto.PricingResponse;
import com.examen1.product_service.mapper.PricingMapper;
import com.examen1.product_service.model.Pricing;
import com.examen1.product_service.repository.PricingRepository;
import com.examen1.product_service.service.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final PricingRepository pricingRepository;
    private final PricingMapper pricingMapper;

    @Override
    public PricingResponse create(PricingRequest request) {
        LocalDateTime startDate = request.getIncioPrecio() != null
                ? request.getIncioPrecio()
                : LocalDateTime.now();

        pricingRepository
                .findCurrentPrice(request.getProductId(), startDate)
                .ifPresent(currentPrice -> {
                    currentPrice.setFinPrecio(startDate);
                    pricingRepository.save(currentPrice);
                });

        Pricing pricing = pricingMapper.toEntity(request);
        pricing.setInicioPrecio(startDate);
        pricing.setFinPrecio(null);

        Pricing saved = pricingRepository.save(pricing);
        return pricingMapper.toResponse(saved);
    }

    @Override
    public PricingResponse getCurrentPrice(Long productId) {
        Pricing pricing = pricingRepository
                .findCurrentPrice(productId, LocalDateTime.now())
                .orElseThrow(() -> new RuntimeException("No hay precio vigente para este producto"));

        return pricingMapper.toResponse(pricing);
    }

    @Override
    public List<PricingResponse> getHistory(Long productId) {
        return pricingRepository.findByProductIdOrderByInicioPrecioDesc(productId)
                .stream()
                .map(pricingMapper::toResponse)
                .toList();
    }

    @Override
    public PricingResponse update(Long id, PricingRequest request) {
        Pricing pricing = pricingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Precio no encontrado"));

        pricing.setProductId(request.getProductId());
        pricing.setPrecio(request.getPrecio());
        pricing.setTipoMoneda(request.getTipoMoneda());
        pricing.setInicioPrecio(request.getIncioPrecio());
        pricing.setFinPrecio(request.getFinPrecio());

        Pricing updated = pricingRepository.save(pricing);
        return pricingMapper.toResponse(updated);
    }

    @Override
    public void delete(Long id) {
        Pricing pricing = pricingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Precio no encontrado"));

        pricing.setFinPrecio(LocalDateTime.now());

        pricingRepository.save(pricing);
    }

}
