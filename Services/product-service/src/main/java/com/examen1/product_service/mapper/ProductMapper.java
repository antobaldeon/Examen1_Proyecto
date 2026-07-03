package com.examen1.product_service.mapper;

import com.examen1.product_service.dto.ProductRequest;
import com.examen1.product_service.dto.ProductResponse;
import com.examen1.product_service.model.Product;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProductMapper {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {};

    public Product toEntity(ProductRequest request) {
        Product product = new Product();
        product.setNombre(request.getNombre());
        product.setDescripcion(request.getDescripcion());
        product.setCategoria(request.getCategoria());
        product.setPrecio(request.getPrecio());
        product.setCodigo(request.getCodigo());
        product.setEstado(request.getEstado());
        product.setImagenUrl(firstImageFrom(request));
        product.setImagenesJson(toJson(imagesFrom(request)));
        return product;
    }

    public ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        List<String> images = fromJson(product.getImagenesJson());
        if (images.isEmpty() && product.getImagenUrl() != null && !product.getImagenUrl().isBlank()) {
            images.add(product.getImagenUrl());
        }

        response.setId(product.getId());
        response.setNombre(product.getNombre());
        response.setDescripcion(product.getDescripcion());
        response.setCategoria(product.getCategoria());
        response.setPrecio(product.getPrecio());
        response.setCodigo(product.getCodigo());
        response.setEstado(product.getEstado());
        response.setImagenUrl(images.isEmpty() ? product.getImagenUrl() : images.get(0));
        response.setImagenesUrls(images);
        response.setFechaCreacion(product.getFechaCreacion());
        return response;
    }

    public String toJson(List<String> images) {
        try {
            return OBJECT_MAPPER.writeValueAsString(images);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("No se pudieron procesar las imagenes del producto.", ex);
        }
    }

    private List<String> fromJson(String value) {
        if (value == null || value.isBlank()) {
            return new ArrayList<>();
        }
        try {
            return OBJECT_MAPPER.readValue(value, STRING_LIST);
        } catch (JsonProcessingException ex) {
            return new ArrayList<>();
        }
    }

    private List<String> imagesFrom(ProductRequest request) {
        List<String> images = new ArrayList<>();
        if (request.getImagenesUrls() != null) {
            request.getImagenesUrls().stream()
                    .filter(image -> image != null && !image.isBlank())
                    .forEach(images::add);
        }
        if (images.isEmpty() && request.getImagenUrl() != null && !request.getImagenUrl().isBlank()) {
            images.add(request.getImagenUrl());
        }
        return images;
    }

    private String firstImageFrom(ProductRequest request) {
        List<String> images = imagesFrom(request);
        return images.isEmpty() ? request.getImagenUrl() : images.get(0);
    }
}
