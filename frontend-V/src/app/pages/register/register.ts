import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../models/auth.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  request: RegisterRequest = {
    nombre: '',
    email: '',
    password: '',
    rol: 'CLIENTE'
  };
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  enviando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      void this.router.navigate(['/']);
    }
  }

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.request.nombre.trim() || !this.request.email.trim() || !this.request.password) {
      this.errorMessage = 'Completa tu nombre, correo y contrasena.';
      return;
    }

    if (this.request.password.length < 6) {
      this.errorMessage = 'La contrasena debe tener al menos 6 caracteres.';
      return;
    }

    if (this.request.password !== this.confirmPassword) {
      this.errorMessage = 'Las contrasenas no coinciden.';
      return;
    }

    this.enviando = true;
    this.authService.register({ ...this.request, rol: 'CLIENTE' }).subscribe({
      next: () => {
        this.enviando = false;
        this.successMessage = 'Cuenta creada. Ya puedes iniciar sesion.';
        window.setTimeout(() => void this.router.navigate(['/login']), 900);
      },
      error: () => {
        this.enviando = false;
        this.errorMessage = 'No se pudo registrar la cuenta. Revisa tus datos o intenta nuevamente.';
      }
    });
  }
}
