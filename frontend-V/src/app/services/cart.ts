import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  addToCart(product: Product, stockDisponible: number): void {
    if (stockDisponible <= 0) return;

    const items = [...this.itemsSubject.value];
    const index = items.findIndex(item => item.product.id === product.id);

    if (index >= 0) {
      const item = items[index];
      const nuevaCantidad = Math.min(item.cantidad + 1, item.stockDisponible);
      items[index] = { ...item, cantidad: nuevaCantidad };
    } else {
      items.push({
        product,
        cantidad: 1,
        stockDisponible
      });
    }

    this.itemsSubject.next(items);
  }

  removeFromCart(productId: number): void {
    this.itemsSubject.next(
      this.itemsSubject.value.filter(item => item.product.id !== productId)
    );
  }

  updateCantidad(productId: number, cantidad: number): void {
    const items = this.itemsSubject.value
      .map(item => {
        if (item.product.id !== productId) return item;

        const cantidadAjustada = Math.max(
          1,
          Math.min(cantidad, item.stockDisponible)
        );

        return {
          ...item,
          cantidad: cantidadAjustada
        };
      });

    this.itemsSubject.next(items);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }

  getTotalItems(): number {
    return this.itemsSubject.value.reduce((total, item) => total + item.cantidad, 0);
  }

  getTotalPrecio(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + item.product.precio * item.cantidad,
      0
    );
  }
}
