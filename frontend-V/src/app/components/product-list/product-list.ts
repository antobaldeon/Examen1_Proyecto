import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Inventory } from '../../models/inventory.model';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { InventoryService } from '../../services/inventory';
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
  inventario = new Map<number, Inventory>();

  productoDetalle: Product | null = null;

  busqueda = '';
  categoriaActiva = 'Todos';
  cargando = true;
  error: string | null = null;
  mensaje: string | null = null;

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
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
    this.cargarInventario();
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

  cargarInventario(): void {
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.inventario = new Map(data.map(item => [item.productId, item]));
      },
      error: () => {
        this.error = 'No pudimos cargar el stock disponible.';
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

  stockDe(productId: number): number {
    return this.inventario.get(productId)?.stockActual ?? 0;
  }

  tieneStock(producto: Product): boolean {
    return producto.estado === 'ACTIVO' && this.stockDe(producto.id) > 0;
  }

  agregarAlCarrito(producto: Product): void {
    const stock = this.stockDe(producto.id);

    if (stock <= 0) {
      this.mostrarMensaje('Producto sin stock disponible.');
      return;
    }

    this.cartService.addToCart(producto, stock);
    this.mostrarMensaje(`${producto.nombre} se agrego al carrito.`);
  }

  abrirDetalle(producto: Product): void {
    this.productoDetalle = producto;
  }

  cerrarDetalle(): void {
    this.productoDetalle = null;
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
