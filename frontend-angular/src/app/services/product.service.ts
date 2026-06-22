import { Injectable } from '@angular/core';
import { API_URL } from '../core/api.config';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = `${API_URL}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getByCodigo(codigo: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/codigo/${codigo}`);
  }
}
