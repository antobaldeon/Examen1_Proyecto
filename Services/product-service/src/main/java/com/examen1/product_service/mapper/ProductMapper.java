package com.examen1.product_service.mapper;

import com.examen1.product_service.dto.ProductRequest;
import com.examen1.product_service.dto.ProductResponse;
import com.examen1.product_service.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequest request) {
        Product product = new Product();
        product.setNombre(request.getNombre());
        product.setDescripcion(request.getDescripcion());
        product.setCategoria(request.getCategoria());
        product.setPrecio(request.getPrecio());
        product.setCodigo(request.getCodigo());
        product.setEstado(request.getEstado());
        return product;
    }

    public ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setNombre(product.getNombre());
        response.setDescripcion(product.getDescripcion());
        response.setCategoria(product.getCategoria());
        response.setPrecio(product.getPrecio());
        response.setCodigo(product.getCodigo());
        response.setEstado(product.getEstado());
        response.setFechaCreacion(product.getFechaCreacion());
        return response;
    }
}
