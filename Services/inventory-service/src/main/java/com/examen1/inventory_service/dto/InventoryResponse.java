package com.examen1.inventory_service.dto;

import com.examen1.inventory_service.model.InventoryStatus;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonPropertyOrder({
        "id",
        "productId",
        "productName",
        "stockActual",
        "stockMinimo",
        "ubicacion",
        "estado",
        "fechaActualizacion"
})
public class InventoryResponse {

    private Long id;
    private Long productId;
    private String productName;
    private Integer stockActual;
    private Integer stockMinimo;
    private String ubicacion;
    private InventoryStatus estado;
    private LocalDateTime fechaActualizacion;

}
