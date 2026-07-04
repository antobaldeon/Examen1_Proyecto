export interface OrderDetailRequest {
  productId: number;
  cantidad: number;
}

export interface OrderDetailResponse {
  id: number;
  productId: number;
  productName: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export type OrderType = 'ENTRADA' | 'SALIDA';

export interface OrderRequest {
  tipo: OrderType;
  usuarioId?: number;
  usuarioNombre?: string;
  usuarioEmail?: string;
  detalles: OrderDetailRequest[];
}

export interface OrderResponse {
  id: number;
  codigo: string;
  tipo: OrderType;
  fecha: string;
  estado: string;
  usuarioId?: number;
  usuarioNombre?: string;
  usuarioEmail?: string;
  subtotal: number;
  igv: number;
  total: number;
  detalles: OrderDetailResponse[];
}
