package examen.usuario_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "roles_db")
@Data
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nombre;


}
