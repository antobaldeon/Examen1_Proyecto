import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  productos: Product[] = [];
  productosFiltrados: Product[] = [];
  busqueda: string = '';
  cargando = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los productos. Verifica que product-service esté corriendo.';
        this.cargando = false;
      }
    });
  }

  filtrar(): void {
    const termino = this.busqueda.trim().toLowerCase();
    if (!termino) {
      this.productosFiltrados = this.productos;
      return;
    }
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.categoria.toLowerCase().includes(termino) ||
      p.codigo.toLowerCase().includes(termino)
    );
  }

  agregarAlCarrito(producto: Product): void {
    this.cartService.addToCart(producto, 1);
  }
}