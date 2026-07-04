import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory, InventoryRequest } from '../models/inventory.model';
import { API_URL } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly baseUrl = `${API_URL}/inventory`;

  constructor(private http: HttpClient) {}

  getByProductId(productId: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.baseUrl}/product/${productId}`);
  }

  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.baseUrl);
  }

  create(inventory: InventoryRequest): Observable<Inventory> {
    return this.http.post<Inventory>(this.baseUrl, inventory);
  }

  addStock(productId: number, cantidad: number): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.baseUrl}/product/${productId}/stock`, {
      cantidad,
      tipo: 'ENTRADA'
    });
  }

  subtractStock(productId: number, cantidad: number): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.baseUrl}/product/${productId}/stock`, {
      cantidad,
      tipo: 'SALIDA'
    });
  }
}
