export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  nombre: string;
  email: string;
  rol: string;
}
