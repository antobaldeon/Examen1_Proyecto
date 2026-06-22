import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private baseUrl = 'http://localhost:8085/api/v1/inventory';

  constructor(private http: HttpClient) {}

  getByProductId(productId: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.baseUrl}/product/${productId}`);
  }
}