import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderRequest, OrderResponse } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:8086/api/v1/orders';

  constructor(private http: HttpClient) {}

  createOrder(order: OrderRequest): Observable<number> {
    return this.http
      .post(this.baseUrl, order, { observe: 'response' })
      .pipe(
        map(response => {
          const location = response.headers.get('Location');
          if (!location) {
            throw new Error('No se pudo obtener el ID de la orden creada');
          }
          return Number(location.split('/').pop());
        })
      );
  }

  getById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${id}`);
  }
}