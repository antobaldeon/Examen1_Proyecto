import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'itmac-cart';
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadItems());
  items$ = this.itemsSubject.asObservable();

  private getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  private loadItems(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) ?? '[]') as CartItem[];
    } catch {
      return [];
    }
  }

  private setItems(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  addToCart(product: Product, cantidad: number = 1): void {
    const items = [...this.getItems()];
    const existente = items.find(i => i.product.id === product.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      items.push({ product, cantidad });
    }
    this.setItems(items);
  }

  removeFromCart(productId: number): void {
    this.setItems(this.getItems().filter(i => i.product.id !== productId));
  }

  updateCantidad(productId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const items = this.getItems().map(i =>
      i.product.id === productId ? { ...i, cantidad } : i
    );
    this.setItems(items);
  }

  getTotalItems(): number {
    return this.getItems().reduce((acc, i) => acc + i.cantidad, 0);
  }

  getTotalPrecio(): number {
    return this.getItems().reduce((acc, i) => acc + i.cantidad * i.product.precio, 0);
  }

  clearCart(): void {
    localStorage.removeItem(this.storageKey);
    this.itemsSubject.next([]);
  }
}
