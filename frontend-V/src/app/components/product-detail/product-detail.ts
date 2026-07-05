import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Inventory } from '../../models/inventory.model';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart';
import { InventoryService } from '../../services/inventory';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  productId: number | null = null;
  producto: Product | null = null;
  inventario: Inventory | null = null;
  cantidad = 1;
  cargando = true;
  error: string | null = null;
  mensaje: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productId = Number.isFinite(id) ? id : null;

    if (!this.productId) {
      this.error = 'Producto no encontrado.';
      this.cargando = false;
      return;
    }

    this.productService.getById(this.productId).subscribe({
      next: (producto) => {
        this.producto = producto;
        this.cargarInventario(producto.id);
      },
      error: () => {
        this.error = 'No se pudo cargar el detalle del producto.';
        this.cargando = false;
      }
    });
  }

  get stockDisponible(): number {
    return this.inventario?.stockActual ?? 0;
  }

  get disponible(): boolean {
    return !!this.producto && this.producto.estado === 'ACTIVO' && this.stockDisponible > 0;
  }

  cambiarCantidad(cantidad: number): void {
    if (!this.disponible) {
      this.cantidad = 1;
      return;
    }

    this.cantidad = Math.min(Math.max(1, cantidad), this.stockDisponible);
  }

  agregarAlCarrito(): void {
    if (!this.producto || !this.disponible) {
      this.mensaje = 'Este producto no esta disponible.';
      return;
    }

    this.cartService.addToCart(this.producto, this.cantidad);
    this.mensaje = `${this.producto.nombre} se agregó al carrito.`;
  }

  private cargarInventario(productId: number): void {
    this.inventoryService.getByProductId(productId).subscribe({
      next: (inventario) => {
        this.inventario = inventario;
        this.cantidad = this.stockDisponible > 0 ? 1 : 0;
        this.cargando = false;
      },
      error: () => {
        this.inventario = null;
        this.cantidad = 0;
        this.cargando = false;
      }
    });
  }
}
