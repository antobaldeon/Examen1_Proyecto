package com.examen1.product_service.service.impl;

import com.examen1.product_service.dto.CategoriaRequest;
import com.examen1.product_service.dto.CategoriaResponse;
import com.examen1.product_service.mapper.CategoriaMapper;
import com.examen1.product_service.model.Categoria;
import com.examen1.product_service.repository.CategoriaRepository;
import com.examen1.product_service.service.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository repository;
    private final CategoriaMapper mapper;

    @Override
    public CategoriaResponse create(CategoriaRequest request) {
        if (repository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new RuntimeException("La categoria ya existe.");
        }

        Categoria categoria = mapper.toEntity(request);
        return mapper.toResponse(repository.save(categoria));
    }

    @Override
    public List<CategoriaResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<CategoriaResponse> getActivas() {
        return repository.findByEstadoIgnoreCase("ACTIVO")
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public CategoriaResponse getById(Long id) {
        return mapper.toResponse(findCategoria(id));
    }

    @Override
    public CategoriaResponse update(Long id, CategoriaRequest request) {
        Categoria categoria = findCategoria(id);

        repository.findByNombreIgnoreCase(request.getNombre())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new RuntimeException("La categoria ya existe.");
                });

        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        categoria.setEstado(request.getEstado());

        return mapper.toResponse(repository.save(categoria));
    }

    @Override
    public void delete(Long id) {
        repository.delete(findCategoria(id));
    }

    private Categoria findCategoria(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada."));
    }
}
