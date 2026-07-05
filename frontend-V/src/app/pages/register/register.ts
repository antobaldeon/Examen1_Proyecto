import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioRequest } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  request: UsuarioRequest = {
    nombre: '',
    email: '',
    password: '',
    rol: 'CLIENTE'
  };

  confirmarPassword = '';
  errorMessage = '';
  successMessage = '';
  enviando = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.request.nombre.trim()) {
      this.errorMessage = 'Ingresa tu nombre.';
      return;
    }

    if (!this.request.email.trim()) {
      this.errorMessage = 'Ingresa tu correo.';
      return;
    }

    if (this.request.password.length < 6) {
      this.errorMessage = 'La contrasena debe tener al menos 6 caracteres.';
      return;
    }

    if (this.request.password !== this.confirmarPassword) {
      this.errorMessage = 'Las contrasenas no coinciden.';
      return;
    }

    this.enviando = true;

    this.usuarioService.register(this.request).subscribe({
      next: () => {
        this.enviando = false;
        this.successMessage = 'Cuenta creada correctamente. Ahora puedes iniciar sesion.';

        setTimeout(() => {
          void this.router.navigate(['/login']);
        }, 1200);
      },
      error: () => {
        this.enviando = false;
        this.errorMessage = 'No se pudo crear la cuenta. Verifica si el correo ya esta registrado.';
      }
    });
  }
}