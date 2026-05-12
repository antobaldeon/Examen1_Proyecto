package examen.auth_service.service;

import examen.auth_service.dto.AuthResponse;
import examen.auth_service.dto.LoginRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);
}
