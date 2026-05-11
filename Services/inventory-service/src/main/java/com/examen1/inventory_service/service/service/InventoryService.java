package com.examen1.inventory_service.service.service;

import com.examen1.inventory_service.dto.InventoryRequest;
import com.examen1.inventory_service.dto.InventoryResponse;
import com.examen1.inventory_service.dto.StockUpdateRequest;

import java.util.List;

public interface InventoryService {

    InventoryResponse create(InventoryRequest request);

    List<InventoryResponse> getAll();

    InventoryResponse getById(Long id);

    InventoryResponse getByProductId(Long productId);

    InventoryResponse update(Long id, InventoryRequest request);

    InventoryResponse updateStock(Long productId, StockUpdateRequest request);


    void delete(Long id);
}
