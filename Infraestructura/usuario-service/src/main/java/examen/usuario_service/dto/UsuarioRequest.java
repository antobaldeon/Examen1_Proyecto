package examen.usuario_service.dto;

import examen.usuario_service.model.Rol;
import lombok.Data;

@Data
public class UsuarioRequest {

    private String nombre;
    private String email;
    private String password;
    private String rol;
}
