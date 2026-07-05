package com.examen1.product_service.controller;

import com.examen1.product_service.dto.CategoriaRequest;
import com.examen1.product_service.dto.CategoriaResponse;
import com.examen1.product_service.service.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categorias")
public class CategoriaController {

    private final CategoriaService service;

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> findAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/activas")
    public ResponseEntity<List<CategoriaResponse>> findActivas() {
        return ResponseEntity.ok(service.getActivas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> create(@Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/v1/categorias/" + response.getId())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
