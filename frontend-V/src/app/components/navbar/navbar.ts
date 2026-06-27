import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  totalItems = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(() => {
      this.totalItems = this.cartService.getTotalItems();
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  get email(): string {
    return this.authService.getEmail() ?? '';
  }

  get roleLabel(): string {
    return this.authService.getRol() === 'ADMIN' ? 'Administrador' : 'Cliente';
  }

  get isAdmin(): boolean {
    return this.authService.getRol() === 'ADMIN';
  }

  logout(): void {
    this.authService.logout();
    this.cartService.clearCart();
    void this.router.navigate(['/login']);
  }
}
