package examen.usuario_service.service.impl;

import examen.usuario_service.dto.UsuarioRequest;
import examen.usuario_service.dto.UsuarioResponse;
import examen.usuario_service.mapper.UsuarioMapper;
import examen.usuario_service.model.Rol;
import examen.usuario_service.model.Usuario;
import examen.usuario_service.repository.RolRepository;
import examen.usuario_service.repository.UsuarioRepository;
import examen.usuario_service.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final RolRepository rolRepository;

    @Override
    public UsuarioResponse register(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        String nombreRol = request.getRol() != null ? request.getRol() : "CLIENTE";

        Rol rol = rolRepository.findByNombre(nombreRol)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + nombreRol));

        Usuario usuario = usuarioMapper.toEntity(request);
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);

        return usuarioMapper.toResponse(usuarioRepository.save(usuario));
    }

    @Override
    public UsuarioResponse findByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return usuarioMapper.toResponse(usuario);
    }

    @Override
    public UsuarioResponse findById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return usuarioMapper.toResponse(usuario);
    }

    @Override
    public List<UsuarioResponse> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toResponse)
                .toList();
    }

}
