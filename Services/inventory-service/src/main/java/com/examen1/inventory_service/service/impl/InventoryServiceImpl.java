package com.examen1.inventory_service.service.impl;

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
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository repository;
    private final InventoryMapper mapper;
    private final ProductLookupService productLookupService;

    @Override
    public InventoryResponse create(InventoryRequest request) {
        validateInventoryRequest(request);

        Product product = productLookupService.getProductById(request.getProductId());

        Inventory inventory = repository.findByProductId(request.getProductId())
                .orElseGet(Inventory::new);

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
    public List<InventoryResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponseWithProduct)
                .sorted(Comparator.comparing(InventoryResponse::getStockActual))
                .toList();
    }

    @Override
    public InventoryResponse getById(Long id) {
        Inventory inventory = findInventory(id);
        return toResponseWithProduct(inventory);
    }

    @Override
    public InventoryResponse getByProductId(Long productId) {
        Inventory inventory = repository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado para el producto indicado."));

        return toResponseWithProduct(inventory);
    }

    @Override
    public InventoryResponse update(Long id, InventoryRequest request) {
        validateInventoryRequest(request);

        Inventory inventory = findInventory(id);
        Product product = productLookupService.getProductById(request.getProductId());

        repository.findByProductId(request.getProductId())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new RuntimeException("Ya existe inventario para este producto.");
                });

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
    public InventoryResponse updateStock(Long productId, StockUpdateRequest request) {
        if (productId == null) {
            throw new RuntimeException("Debe indicar el producto.");
        }

        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a cero.");
        }

        Inventory inventory = repository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado para el producto indicado."));

        if ("SALIDA".equalsIgnoreCase(request.getTipo())) {
            if (inventory.getStockActual() < request.getCantidad()) {
                throw new RuntimeException("Stock insuficiente.");
            }

            inventory.setStockActual(inventory.getStockActual() - request.getCantidad());
        } else if ("ENTRADA".equalsIgnoreCase(request.getTipo())) {
            inventory.setStockActual(inventory.getStockActual() + request.getCantidad());
        } else {
            throw new RuntimeException("Tipo de movimiento invalido. Use ENTRADA o SALIDA.");
        }

        inventory.setEstado(calculateStatus(inventory.getStockActual(), inventory.getStockMinimo()));
        inventory.setFechaActualizacion(LocalDateTime.now());

        inventory = repository.save(inventory);

        return toResponseWithProduct(inventory);
    }

    @Override
    public void delete(Long id) {
        Inventory inventory = findInventory(id);
        repository.delete(inventory);
    }

    private InventoryResponse toResponseWithProduct(Inventory inventory) {
        InventoryResponse response = mapper.toResponse(inventory);

        try {
            Product product = productLookupService.getProductById(inventory.getProductId());
            response.setProductName(product.getNombre());
        } catch (RuntimeException ex) {
            response.setProductName("Producto no disponible");
        }

        return response;
    }

    private Inventory findInventory(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado."));
    }

    private void validateInventoryRequest(InventoryRequest request) {
        if (request.getProductId() == null) {
            throw new RuntimeException("Debe indicar el producto.");
        }

        if (request.getStockActual() == null || request.getStockActual() < 0) {
            throw new RuntimeException("El stock actual no puede ser negativo.");
        }

        if (request.getStockMinimo() == null || request.getStockMinimo() < 0) {
            throw new RuntimeException("El stock minimo no puede ser negativo.");
        }

        if (request.getUbicacion() == null || request.getUbicacion().isBlank()) {
            throw new RuntimeException("Debe indicar la ubicacion del inventario.");
        }
    }

    private InventoryStatus calculateStatus(Integer stockActual, Integer stockMinimo) {
        if (stockActual == 0) {
            return InventoryStatus.SIN_STOCK;
        }

        if (stockActual <= stockMinimo || stockActual <= 5) {
            return InventoryStatus.STOCK_BAJO;
        }

        return InventoryStatus.DISPONIBLE;
    }
}