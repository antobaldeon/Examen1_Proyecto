package com.examen1.inventory_service.service.impl;

import com.examen1.inventory_service.client.ProductClient;
import com.examen1.inventory_service.dto.InventoryRequest;
import com.examen1.inventory_service.dto.InventoryResponse;
import com.examen1.inventory_service.dto.StockUpdateRequest;
import com.examen1.inventory_service.mapper.InventoryMapper;
import com.examen1.inventory_service.model.Inventory;
import com.examen1.inventory_service.model.InventoryStatus;
import com.examen1.inventory_service.model.Product;
import com.examen1.inventory_service.repository.InventoryRepository;
import com.examen1.inventory_service.service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository repository;
    private final InventoryMapper mapper;
    private final ProductLookupService productLookupService;


    @Override
    public InventoryResponse create(InventoryRequest request) {
        Product product = productLookupService.getProductById(request.getProductId());

        Inventory inventory = mapper.toEntity(request);
        inventory.setEstado(calculateStatus(request.getStockActual(), request.getStockMinimo()));
        inventory.setFechaActualizacion(LocalDateTime.now());

        inventory = repository.save(inventory);

        InventoryResponse response = mapper.toResponse(inventory);
        response.setProductName(product.getNombre());
        return response;
    }

    @Override
    public List<InventoryResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(inventory -> {
                    InventoryResponse response = mapper.toResponse(inventory);
                    Product product = productLookupService.getProductById(inventory.getProductId());
                    response.setProductName(product.getNombre());
                    return response;
                })
                .toList();
    }

    @Override
    public InventoryResponse getById(Long id) {
        Inventory inventory = findInventory(id);
        Product product = productLookupService.getProductById(inventory.getProductId());

        InventoryResponse response = mapper.toResponse(inventory);
        response.setProductName(product.getNombre());
        return response;
    }

    @Override
    public InventoryResponse getByProductId(Long productId) {
        Inventory inventory = repository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Inventory not found for product"));

        Product product = productLookupService.getProductById(inventory.getProductId());

        InventoryResponse response = mapper.toResponse(inventory);
        response.setProductName(product.getNombre());
        return response;
    }
    @Override
    public InventoryResponse updateStock(Long productId, StockUpdateRequest request) {
        Inventory inventory = repository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Inventory not found for product"));

        if ("SALIDA".equalsIgnoreCase(request.getTipo())) {
            if (inventory.getStockActual() < request.getCantidad()) {
                throw new RuntimeException("Insufficient stock");
            }
            inventory.setStockActual(inventory.getStockActual() - request.getCantidad());
        }

        if ("ENTRADA".equalsIgnoreCase(request.getTipo())) {
            inventory.setStockActual(inventory.getStockActual() + request.getCantidad());
        }

        inventory.setEstado(calculateStatus(inventory.getStockActual(), inventory.getStockMinimo()));
        inventory.setFechaActualizacion(LocalDateTime.now());

        inventory = repository.save(inventory);

        InventoryResponse response = mapper.toResponse(inventory);
        Product product = productLookupService.getProductById(inventory.getProductId());
        response.setProductName(product.getNombre());

        return response;
    }


    @Override
    public InventoryResponse update(Long id, InventoryRequest request) {
        Inventory inventory = findInventory(id);
        Product product = productLookupService.getProductById(request.getProductId());

        inventory.setProductId(request.getProductId());
        inventory.setStockActual(request.getStockActual());
        inventory.setStockMinimo(request.getStockMinimo());
        inventory.setUbicacion(request.getUbicacion());
        inventory.setEstado(calculateStatus(request.getStockActual(), request.getStockMinimo()));
        inventory.setFechaActualizacion(LocalDateTime.now());

        inventory = repository.save(inventory);

        InventoryResponse response = mapper.toResponse(inventory);
        response.setProductName(product.getNombre());
        return response;
    }


    @Override
    public void delete(Long id) {
        Inventory inventory = findInventory(id);
        repository.delete(inventory);
    }


    private Inventory findInventory(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
    }

    private InventoryStatus calculateStatus(Integer stockActual, Integer stockMinimo) {
        if (stockActual == 0) {
            return InventoryStatus.SIN_STOCK;
        }
        if (stockActual <= stockMinimo) {
            return InventoryStatus.STOCK_BAJO;
        }
        return InventoryStatus.DISPONIBLE;
    }
}
