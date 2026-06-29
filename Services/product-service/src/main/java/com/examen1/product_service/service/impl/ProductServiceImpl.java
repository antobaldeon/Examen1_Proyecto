package com.examen1.product_service.service.impl;

import com.examen1.product_service.dto.ProductRequest;
import com.examen1.product_service.dto.ProductResponse;
import com.examen1.product_service.mapper.ProductMapper;
import com.examen1.product_service.model.Product;
import com.examen1.product_service.repository.ProductRepository;
import com.examen1.product_service.service.service.PricingService;
import com.examen1.product_service.service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;
    private final ProductMapper mapper;
    private final PricingService pricingService;


    @Override
    public ProductResponse create(ProductRequest request) {
        Product product = mapper.toEntity(request);
        product.setFechaCreacion(LocalDateTime.now());
        product = repository.save(product);
        return mapper.toResponse(product);
    }

    @Override
    public List<ProductResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(product -> enrichWithCurrentPrice(mapper.toResponse(product)))
                .toList();
    }


    @Override
    public ProductResponse getById(Long id) {
        Product product = findProduct(id);
        return enrichWithCurrentPrice(mapper.toResponse(product));

    }
    @Override
    public ProductResponse getByCodigo(String codigo) {
        Product product = repository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return enrichWithCurrentPrice(mapper.toResponse(product));
    }


    @Override
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findProduct(id);

        product.setNombre(request.getNombre());
        product.setDescripcion(request.getDescripcion());
        product.setCategoria(request.getCategoria());
        product.setPrecio(request.getPrecio());
        product.setCodigo(request.getCodigo());
        product.setEstado(request.getEstado());
        product.setImagenUrl(request.getImagenUrl());

        product = repository.save(product);
        return mapper.toResponse(product);
    }

    @Override
    public void delete(Long id) {
        Product product = findProduct(id);
        repository.delete(product);
    }

    private Product findProduct(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    private ProductResponse enrichWithCurrentPrice(ProductResponse response) {
        try {
            var currentPrice = pricingService.getCurrentPrice(response.getId());
            response.setPrecio(currentPrice.getPrecio().doubleValue());
            response.setTipoMoneda(currentPrice.getTipoMoneda());
        } catch (RuntimeException ex) {

        }

        return response;
    }


}
