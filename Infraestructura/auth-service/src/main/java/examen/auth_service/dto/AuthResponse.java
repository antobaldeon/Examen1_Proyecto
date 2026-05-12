package examen.auth_service.dto;

import lombok.Data;

@Data
public class AuthResponse {

    private String token;
    private Long userId;
    private String email;
    private String rol;
}
