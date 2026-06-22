export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  codigo: string;
  estado: string;
  fechaCreacion?: string;
  tipoMoneda?: string;
}