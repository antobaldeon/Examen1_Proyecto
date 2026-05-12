package examen.auth_service.service.impl;

import examen.auth_service.client.UsuarioClient;
import examen.auth_service.dto.AuthResponse;
import examen.auth_service.dto.LoginRequest;
import examen.auth_service.dto.UsuarioResponse;
import examen.auth_service.security.JwtService;
import examen.auth_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioClient usuarioClient;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest request) {
        UsuarioResponse usuario = usuarioClient.findByEmail(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        AuthResponse response = new AuthResponse();
        response.setToken(jwtService.generateToken(usuario));
        response.setUserId(usuario.getId());
        response.setEmail(usuario.getEmail());
        response.setRol(usuario.getRol());

        return response;
    }

}
