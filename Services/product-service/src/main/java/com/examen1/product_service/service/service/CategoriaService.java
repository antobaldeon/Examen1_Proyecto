package com.examen1.product_service.service.service;

import com.examen1.product_service.dto.CategoriaRequest;
import com.examen1.product_service.dto.CategoriaResponse;

import java.util.List;

public interface CategoriaService {

    CategoriaResponse create(CategoriaRequest request);

    List<CategoriaResponse> getAll();

    List<CategoriaResponse> getActivas();

    CategoriaResponse getById(Long id);

    CategoriaResponse update(Long id, CategoriaRequest request);

    void delete(Long id);
}
