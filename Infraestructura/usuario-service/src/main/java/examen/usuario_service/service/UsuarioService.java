package examen.usuario_service.service;

import examen.usuario_service.dto.UsuarioRequest;
import examen.usuario_service.dto.UsuarioResponse;

import java.util.List;

public interface UsuarioService {

    UsuarioResponse register(UsuarioRequest request);

    UsuarioResponse createAdmin(UsuarioRequest request);

    UsuarioResponse findByEmail(String email);

    UsuarioResponse findById(Long id);

    List<UsuarioResponse> findAll();

    UsuarioResponse update(Long id, UsuarioRequest request);

    UsuarioResponse updatePassword(Long id, String password);

}
