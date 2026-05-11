package com.examen1.inventory_service.mapper;

import com.examen1.inventory_service.dto.InventoryRequest;
import com.examen1.inventory_service.dto.InventoryResponse;
import com.examen1.inventory_service.model.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public Inventory toEntity(InventoryRequest request) {
        Inventory inventory = new Inventory();
        inventory.setProductId(request.getProductId());
        inventory.setStockActual(request.getStockActual());
        inventory.setStockMinimo(request.getStockMinimo());
        inventory.setUbicacion(request.getUbicacion());
        return inventory;
    }

    public InventoryResponse toResponse(Inventory inventory) {
        InventoryResponse response = new InventoryResponse();
        response.setId(inventory.getId());
        response.setProductId(inventory.getProductId());
        response.setStockActual(inventory.getStockActual());
        response.setStockMinimo(inventory.getStockMinimo());
        response.setUbicacion(inventory.getUbicacion());
        response.setEstado(inventory.getEstado());
        response.setFechaActualizacion(inventory.getFechaActualizacion());
        return response;
    }

}
