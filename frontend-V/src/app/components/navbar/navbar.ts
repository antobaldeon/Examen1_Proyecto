import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  email: string | null = '';
  nombre: string | null = '';
  rol: string | null = '';
  totalItems = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail();
    this.nombre = this.authService.getNombre();
    this.rol = this.authService.getRol();

    this.cartService.items$.subscribe(items => {
      this.totalItems = items.reduce((total, item) => total + item.cantidad, 0);
    });
  }

  get isAdmin(): boolean {
    return this.authService.getRol() === 'ADMIN';
  }

  get isCliente(): boolean {
    return this.authService.getRol() === 'CLIENTE';
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get displayName(): string {
    return this.nombre || this.email || 'Usuario';
  }

  get roleLabel(): string {
    if (this.isAdmin) return 'ADMINISTRADOR';
    if (this.isCliente) return 'Bienvenido';
    return 'INVITADO';
  }

  goToCart(): void {
    if (!this.isLoggedIn) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    void this.router.navigate(['/cart']);
  }

  goToLogin(): void {
    void this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.cartService.clearCart();
    this.email = null;
    this.nombre = null;
    this.rol = null;
    void this.router.navigate(['/products']);
  }
}