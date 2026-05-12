package com.examen1.product_service.controller;

import com.examen1.product_service.dto.PricingRequest;
import com.examen1.product_service.dto.PricingResponse;
import com.examen1.product_service.service.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products/pricing")
public class PricingController {

    private final PricingService pricingService;

    @PostMapping
    public PricingResponse create(@RequestBody PricingRequest request) {
        return pricingService.create(request);
    }

    @GetMapping("/{productId}/current")
    public PricingResponse getCurrentPrice(@PathVariable Long productId) {
        return pricingService.getCurrentPrice(productId);
    }

    @GetMapping("/{productId}/history")
    public List<PricingResponse> getHistory(@PathVariable Long productId) {
        return pricingService.getHistory(productId);
    }

    @PutMapping("/{id}")
    public PricingResponse update(
            @PathVariable Long id,
            @RequestBody PricingRequest request
    ) {
        return pricingService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        pricingService.delete(id);
    }

}
