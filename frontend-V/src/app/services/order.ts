import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest, OrderResponse } from '../models/order.model';
import { API_URL } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly baseUrl = `${API_URL}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, order);
  }

  getAll(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${id}`);
  }

  cancel(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/status?status=CANCELADA`, null);
  }
}
