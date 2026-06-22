import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: Product[] = [];

  constructor(
  private productService: ProductService,
  private authService: AuthService, 
  private router: Router,
  private cdr: ChangeDetectorRef


) {}

  ngOnInit(): void {
  console.log('Entrando a Products');

  this.productService.getAll().subscribe({
    next: data => {
      console.log('Productos recibidos:', data);
      this.products = data;
      this.cdr.detectChanges();
    },
    error: err => {
      console.error('Error al cargar productos:', err);
    }

  });
  
}

  isAdmin(): boolean {
  return this.authService.getRol() === 'ADMIN';
}
logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}
}