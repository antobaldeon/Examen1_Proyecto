import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/product';

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
  busqueda = '';
  categoriaActiva = 'Todos';
  cargando = true;
  error: string | null = null;
  mensaje: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      void this.router.navigate(['/admin']);
      return;
    }

    this.cargarProductos();
  }

  get categorias(): string[] {
    return ['Todos', ...new Set(this.productos.map((producto) => producto.categoria).filter(Boolean))];
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = null;

    this.productService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => {
        this.error = 'No pudimos cargar el catalogo. Revisa que product-service este disponible.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    const termino = this.busqueda.trim().toLowerCase();

    this.productosFiltrados = this.productos.filter((producto) => {
      const coincideCategoria =
        this.categoriaActiva === 'Todos' || producto.categoria === this.categoriaActiva;

      const coincideTexto =
        !termino ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino) ||
        producto.codigo.toLowerCase().includes(termino);

      return coincideCategoria && coincideTexto;
    });
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaActiva = categoria;
    this.aplicarFiltros();
  }

  agregarAlCarrito(producto: Product): void {
    this.cartService.addToCart(producto);
    this.mostrarMensaje(`${producto.nombre} se agrego al carrito.`);
  }

  identificadorVisual(producto: Product): string {
    return producto.nombre
      .split(' ')
      .slice(0, 2)
      .map((palabra) => palabra.charAt(0))
      .join('')
      .toUpperCase();
  }

  private mostrarMensaje(mensaje: string): void {
    this.mensaje = mensaje;
    window.setTimeout(() => (this.mensaje = null), 2600);
  }
}
