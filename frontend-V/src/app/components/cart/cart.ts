import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { OrderRequest, OrderResponse } from '../../models/order.model';
import { PaymentModalComponent } from '../payment-modal/payment-modal';
import { AuthService } from '../../services/auth';

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

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      void this.router.navigate(['/admin']);
      return;
    }

    this.cartService.items$.subscribe(items => this.items = items);
  }

  quitarProducto(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  cambiarCantidad(productId: number, cantidad: number): void {
    this.cartService.updateCantidad(productId, cantidad);
  }

  getTotal(): number {
    return this.cartService.getTotalPrecio();
  }

  realizarPago(): void {
    if (this.items.length === 0) return;

    if (!this.authService.isLoggedIn()) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    if (this.authService.isAdmin()) {
      this.errorOrden = 'Los administradores no pueden realizar compras.';
      return;
    }

    this.creandoOrden = true;
    this.errorOrden = null;

    const email = this.authService.getEmail() ?? '';

    const orderRequest: OrderRequest = {
      tipo: 'SALIDA',
      usuarioId: this.authService.getUserId() ?? undefined,
      usuarioNombre: this.authService.getNombre() || email.split('@')[0],
      usuarioEmail: email,
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
}
