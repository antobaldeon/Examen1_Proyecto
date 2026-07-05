export interface UsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}