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
  imagenUrl?: string;
  imagenesUrls?: string[];
}

export interface ProductRequest {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  codigo: string;
  estado: string;
  imagenUrl?: string;
  imagenesUrls?: string[];
}

export interface ImageUploadResponse {
  fileId: string;
  imageUrl: string;
  webViewLink: string;
}
