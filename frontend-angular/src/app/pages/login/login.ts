import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  ngOnInit(): void {
  if (this.authService.isLoggedIn()) {
    this.router.navigate(['/products']);
  }
}
  
  request: LoginRequest = {
    email: '',
    password: ''
  };
  

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.request.email || !this.request.password) {
  this.errorMessage = 'Completa correo y contraseña';
  return;
}

    this.authService.login(this.request).subscribe({
      next: response => {
        this.authService.saveSession(response);
        this.router.navigate(['/products']);
      },
      error: () => {
        this.errorMessage = 'Credenciales incorrectas';
      }
    });
  }
}
