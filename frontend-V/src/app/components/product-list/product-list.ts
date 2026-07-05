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
    if (this.esAdmin) {
      void this.router.navigate(['/admin']);
      return;
    }

    this.cargarProductos();
  }

  get esAdmin(): boolean {
    return this.authService.getRol() === 'ADMIN';
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
        this.cargarInventario();
      },
      error: () => {
        this.error = 'No pudimos cargar el catálogo. Revisa que product-service esté disponible.';
        this.cargando = false;
      }
    });
  }

  cargarInventario(): void {
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.inventario = new Map(data.map((item) => [item.productId, item]));
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

  verDetalle(producto: Product): void {
    void this.router.navigate(['/products', producto.id]);
  }

  agregarAlCarrito(producto: Product): void {
    if (!this.estaDisponible(producto)) {
      this.mostrarMensaje(`${producto.nombre} no esta disponible.`);
      return;
    }

    this.cartService.addToCart(producto);
    this.mostrarMensaje(`${producto.nombre} se agregó al carrito.`);
  }

  reponerStock(productId: number): void {
    this.inventoryService.addStock(productId, 1).subscribe({
      next: (inventory) => {
        this.inventario.set(productId, inventory);
        this.inventario = new Map(this.inventario);
        this.mostrarMensaje('Se agregó una unidad al inventario.');
      },
      error: () => (this.error = 'No se pudo actualizar el stock.')
    });
  }

  eliminarProducto(producto: Product): void {
    if (!confirm(`¿Eliminar "${producto.nombre}" del catálogo?`)) return;

    this.productService.delete(producto.id).subscribe({
      next: () => {
        this.mostrarMensaje('Producto eliminado.');
        this.cargarProductos();
      },
      error: () => (this.error = 'No se puede eliminar un producto que ya tiene movimientos.')
    });
  }

  stockDe(productId: number): number | null {
    return this.inventario.get(productId)?.stockActual ?? null;
  }

  estaDisponible(producto: Product): boolean {
    const stock = this.stockDe(producto.id);
    return producto.estado === 'ACTIVO' && stock !== null && stock > 0;
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
