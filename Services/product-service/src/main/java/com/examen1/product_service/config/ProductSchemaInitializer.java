package com.examen1.product_service.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductSchemaInitializer implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        jdbcTemplate.execute("ALTER TABLE product_db MODIFY COLUMN descripcion LONGTEXT");
        jdbcTemplate.execute("ALTER TABLE product_db MODIFY COLUMN imagen_url LONGTEXT");
        jdbcTemplate.execute("ALTER TABLE product_db MODIFY COLUMN imagenes_json LONGTEXT");
    }
}
