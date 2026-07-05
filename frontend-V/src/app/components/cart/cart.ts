import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';
import { Inventory } from '../../models/inventory.model';
import { CartService } from '../../services/cart';
import { InventoryService } from '../../services/inventory';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { OrderRequest, OrderResponse } from '../../models/order.model';
import { PaymentModalComponent } from '../payment-modal/payment-modal';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, PaymentModalComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  mostrarModalPago = false;
  orderCreada: OrderResponse | null = null;
  creandoOrden = false;
  errorOrden: string | null = null;
  inventario = new Map<number, Inventory>();

  constructor(
    private cartService: CartService,
    private inventoryService: InventoryService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => this.items = items);
    this.cargarInventario();
  }

  quitarProducto(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  cambiarCantidad(productId: number, cantidad: number): void {
    const stock = this.stockDe(productId);
    const cantidadValidada = stock === null ? cantidad : Math.min(cantidad, stock);
    this.cartService.updateCantidad(productId, cantidadValidada);
  }

  getTotal(): number {
    return this.cartService.getTotalPrecio();
  }

  realizarPago(): void {
    if (this.items.length === 0) return;

    if (!this.puedePagar()) {
      this.errorOrden = 'Hay productos sin stock suficiente. Ajusta las cantidades antes de continuar.';
      return;
    }

    const usuario = this.authService.getUsuarioActual();

    if (!usuario) {
      this.errorOrden = 'No se pudo identificar al cliente. Inicia sesion nuevamente.';
      return;
    }

    this.creandoOrden = true;
    this.errorOrden = null;

    const orderRequest: OrderRequest = {
      tipo: 'SALIDA',
      usuarioId: usuario.id,
      usuarioNombre: usuario.nombre,
      usuarioEmail: usuario.email,
      detalles: this.items.map(i => ({
        productId: i.product.id,
        cantidad: i.cantidad
      }))
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (orderId) => {
        this.orderService.getById(orderId).subscribe({
          next: (orderResponse) => {
            this.orderCreada = orderResponse;
            this.creandoOrden = false;
            this.mostrarModalPago = true;
          },
          error: (err) => {
            console.error(err);
            this.errorOrden = 'Orden creada pero no se pudo cargar el detalle.';
            this.creandoOrden = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorOrden = 'No se pudo crear la orden. Intenta nuevamente.';
        this.creandoOrden = false;
      }
    });
  }

  cerrarModalPago(): void {
    this.mostrarModalPago = false;
  }

  pagoConfirmado(): void {
    this.cartService.clearCart();
    this.mostrarModalPago = false;
    this.orderCreada = null;
  }

  volver(): void {
    this.router.navigate(['/products']);
  }

  getSubtotal(): number {
    return this.cartService.getTotalPrecio();
  }

  getIgv(): number {
    return Math.round(this.getSubtotal() * 0.18 * 100) / 100;
  }

  getTotalConIgv(): number {
    return Math.round((this.getSubtotal() + this.getIgv()) * 100) / 100;
  }

  identificadorVisual(nombre: string): string {
    return nombre
      .split(' ')
      .slice(0, 2)
      .map((palabra) => palabra.charAt(0))
      .join('')
      .toUpperCase();
  }

  stockDe(productId: number): number | null {
    return this.inventario.get(productId)?.stockActual ?? null;
  }

  sinStock(item: CartItem): boolean {
    const stock = this.stockDe(item.product.id);
    return stock !== null && stock <= 0;
  }

  superaStock(item: CartItem): boolean {
    const stock = this.stockDe(item.product.id);
    return stock !== null && item.cantidad > stock;
  }

  puedePagar(): boolean {
    return this.items.length > 0 && this.items.every(item => {
      const stock = this.stockDe(item.product.id);
      return stock !== null && stock > 0 && item.cantidad <= stock;
    });
  }

  private cargarInventario(): void {
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.inventario = new Map(data.map((item) => [item.productId, item]));
      },
      error: () => {
        this.errorOrden = 'No se pudo verificar el stock del carrito.';
      }
    });
  }
}
