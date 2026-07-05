import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "../core/api.config";
import { AuthResponse, LoginRequest } from "../models/auth.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly baseUrl = `${API_URL}/auth`;
  private readonly tokenKey = "token";

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request);
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem("userId", String(response.userId));
    localStorage.setItem("nombre", response.nombre);
    localStorage.setItem("email", response.email);
    localStorage.setItem("rol", response.rol);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getEmail(): string | null {
    return localStorage.getItem("email");
  }

  getRol(): string | null {
    return localStorage.getItem("rol");
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payloadPart = token
        .split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const paddedPayload = payloadPart.padEnd(
        Math.ceil(payloadPart.length / 4) * 4,
        "=",
      );
      const payload = JSON.parse(atob(paddedPayload));
      const isValid =
        typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
      if (!isValid) this.logout();
      return isValid;
    } catch {
      this.logout();
      return false;
    }
  }

  logout(): void {
  localStorage.removeItem(this.tokenKey);
  localStorage.removeItem('userId');
  localStorage.removeItem('nombre');
  localStorage.removeItem('email');
  localStorage.removeItem('rol');
}
  getNombre(): string | null {
    return localStorage.getItem("nombre");
  }

  getUserId(): number | null {
    const userId = localStorage.getItem("userId");
    return userId ? Number(userId) : null;
  }

  getUsuarioActual(): { id: number; nombre: string; email: string } | null {
    const id = this.getUserId();
    const nombre = this.getNombre();
    const email = this.getEmail();

    if (!id || !nombre || !email) return null;

    return {
      id,
      nombre,
      email,
    };
  }
}
