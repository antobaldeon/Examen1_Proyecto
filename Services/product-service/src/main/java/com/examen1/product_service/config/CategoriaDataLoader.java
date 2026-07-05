package com.examen1.product_service.config;

import com.examen1.product_service.model.Categoria;
import com.examen1.product_service.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CategoriaDataLoader implements CommandLineRunner {

    private final CategoriaRepository repository;

    @Override
    public void run(String... args) {
        List<String> nombres = List.of(
                "Elevacion",
                "Gruas",
                "Herramientas",
                "Diagnostico",
                "Lubricacion",
                "Seguridad",
                "Neumaticos",
                "Electricidad",
                "Repuestos",
                "Accesorios"
        );

        List<Categoria> categorias = nombres.stream()
                .filter(nombre -> !repository.existsByNombreIgnoreCase(nombre))
                .map(nombre -> {
                    Categoria categoria = new Categoria();
                    categoria.setNombre(nombre);
                    categoria.setDescripcion("Categoria de " + nombre.toLowerCase());
                    categoria.setEstado("ACTIVO");
                    return categoria;
                })
                .toList();

        repository.saveAll(categorias);
    }
}
