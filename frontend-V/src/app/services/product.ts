import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, ProductRequest } from '../models/product.model';
import { API_URL } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = `${API_URL}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(product: ProductRequest): Observable<number> {
    return this.http.post(this.baseUrl, product, { observe: 'response' }).pipe(
      map((response) => {
        const location = response.headers.get('Location');
        const productId = Number(location?.split('/').pop());
        if (!location || !Number.isFinite(productId)) {
          throw new Error('El backend no devolvió el ID del producto.');
        }
        return productId;
      })
    );
  }

  update(id: number, product: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
