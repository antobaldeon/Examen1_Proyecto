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
  detalles: OrderDetailRequest[];
}

export interface OrderResponse {
  id: number;
  tipo: OrderType;
  fecha: string;
  estado: string;
  subtotal: number;
  igv: number;
  total: number;
  detalles: OrderDetailResponse[];
}