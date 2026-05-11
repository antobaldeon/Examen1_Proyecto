package com.examen1.product_service.service.service;

import com.examen1.product_service.dto.ProductRequest;
import com.examen1.product_service.dto.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse create(ProductRequest request);

    List<ProductResponse> getAll();

    ProductResponse getById(Long id);

    ProductResponse update(Long id, ProductRequest request);

    void delete(Long id);
}
