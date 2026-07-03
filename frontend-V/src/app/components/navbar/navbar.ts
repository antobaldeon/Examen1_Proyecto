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
  accountMenuOpen = false;

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

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
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

  toggleAccountMenu(): void {
    this.accountMenuOpen = !this.accountMenuOpen;
  }

  goToCart(): void {
    if (!this.isLoggedIn) {
      void this.router.navigate(['/login']);
      return;
    }

    void this.router.navigate(['/cart']);
  }

  logout(): void {
    this.authService.logout();
    this.cartService.clearCart();
    this.accountMenuOpen = false;
    void this.router.navigate(['/']);
  }
}
