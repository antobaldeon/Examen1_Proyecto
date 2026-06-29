package com.examen1.payment_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payments_db")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(nullable = false)
    private Double monto;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(name = "numero_tarjeta", nullable = false)
    private String numeroTarjeta;

    @Column(name = "fecha_expiracion", nullable = false)
    private String fechaExpiracion;

    @Column(name = "codigo_seguridad", nullable = false)
    private String codigoSeguridad;

    @Column(name = "numero_telefono")
    private String numeroTelefono;

    @Column(name = "correo_electronico", nullable = false)
    private String correoElectronico;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String ciudad;

    @Column(nullable = false)
    private LocalDateTime fechaPago;

    @Column(nullable = false)
    private String estado;
}
