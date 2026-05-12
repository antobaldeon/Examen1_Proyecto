package examen.usuario_service.controller;

import examen.usuario_service.dto.UsuarioRequest;
import examen.usuario_service.dto.UsuarioResponse;
import examen.usuario_service.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/register")
    public UsuarioResponse register(@RequestBody UsuarioRequest request) {
        return usuarioService.register(request);
    }

    @GetMapping("/email/{email}")
    public UsuarioResponse findByEmail(@PathVariable String email) {
        return usuarioService.findByEmail(email);
    }

    @GetMapping("/{id}")
    public UsuarioResponse findById(@PathVariable Long id) {
        return usuarioService.findById(id);
    }

    @GetMapping
    public List<UsuarioResponse> findAll() {
        return usuarioService.findAll();
    }

}
