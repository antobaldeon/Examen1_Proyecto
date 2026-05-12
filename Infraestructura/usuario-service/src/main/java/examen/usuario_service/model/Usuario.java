package examen.usuario_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "usuario-db")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

}
