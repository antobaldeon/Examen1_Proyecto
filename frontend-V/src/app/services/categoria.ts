import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api.config';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly baseUrl = `${API_URL}/categorias`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl);
  }

  getActivas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/activas`);
  }

  getById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/${id}`);
  }

  create(categoria: Omit<Categoria, 'id'>): Observable<void> {
    return this.http.post<void>(this.baseUrl, categoria);
  }

  update(id: number, categoria: Omit<Categoria, 'id'>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.baseUrl}/${id}`, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}