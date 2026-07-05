package com.examen1.product_service.mapper;

import com.examen1.product_service.dto.CategoriaRequest;
import com.examen1.product_service.dto.CategoriaResponse;
import com.examen1.product_service.model.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public Categoria toEntity(CategoriaRequest request) {
        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        categoria.setEstado(request.getEstado());
        return categoria;
    }

    public CategoriaResponse toResponse(Categoria categoria) {
        CategoriaResponse response = new CategoriaResponse();
        response.setId(categoria.getId());
        response.setNombre(categoria.getNombre());
        response.setDescripcion(categoria.getDescripcion());
        response.setEstado(categoria.getEstado());
        return response;
    }
}
