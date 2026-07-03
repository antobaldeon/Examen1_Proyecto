import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../models/auth.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  request: LoginRequest = { email: '', password: '' };
  errorMessage = '';
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

  login(): void {
    this.errorMessage = '';

    if (!this.request.email.trim() || !this.request.password) {
      this.errorMessage = 'Completa el correo y la contrasena.';
      return;
    }

    this.enviando = true;
    this.authService.login(this.request).subscribe({
      next: (response) => {
        this.authService.saveSession(response);
        this.enviando = false;
        void this.router.navigate(['/']);
      },
      error: () => {
        this.enviando = false;
        this.errorMessage = 'Credenciales incorrectas o servicio no disponible.';
      }
    });
  }
}
