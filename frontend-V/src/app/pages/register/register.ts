import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../models/auth.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../login/login.css'
})
export class RegisterComponent {
  request: RegisterRequest = { nombre: '', email: '', password: '' };
  confirmarPassword = '';
  errorMessage = '';
  successMessage = '';
  enviando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.request.nombre.trim() || !this.request.email.trim() || !this.request.password) {
      this.errorMessage = 'Completa tus datos para crear la cuenta.';
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

    this.authService.register(this.request).subscribe({
      next: () => {
        this.enviando = false;
        this.successMessage = 'Cuenta creada correctamente. Ahora puedes iniciar sesion.';
        window.setTimeout(() => void this.router.navigate(['/login']), 900);
      },
      error: () => {
        this.enviando = false;
        this.errorMessage = 'No se pudo crear la cuenta. Verifica si el correo ya existe.';
      }
    });
  }
}
