import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
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
  orderCreada: OrderResponse | null = null; // 👈 ahora guardamos la orden completa
  creandoOrden = false;
  errorOrden: string | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => this.items = items);
  }

  quitarProducto(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  cambiarCantidad(productId: number, cantidad: number): void {
    this.cartService.updateCantidad(productId, cantidad);
  }

  getTotal(): number {
    return this.cartService.getTotalPrecio(); // estimado sin IGV, solo referencial mientras compra
  }

  realizarPago(): void {
    if (this.items.length === 0) return;

    this.creandoOrden = true;
    this.errorOrden = null;

    const orderRequest: OrderRequest = {
      tipo: 'SALIDA',
      detalles: this.items.map(i => ({
        productId: i.product.id,
        cantidad: i.cantidad
      }))
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (orderId) => {
        // 👇 Una vez creada, pedimos el detalle real con subtotal/igv/total calculados por el backend
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
    this.router.navigate(['/']);
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
}