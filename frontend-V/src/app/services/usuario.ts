import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api.config';
import { UsuarioRequest, UsuarioResponse } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly baseUrl = `${API_URL}/usuarios`;

  constructor(private http: HttpClient) {}

  register(request: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.baseUrl}/register`, request);
  }
  getAll(): Observable<UsuarioResponse[]> {
  return this.http.get<UsuarioResponse[]>(this.baseUrl);
}
}