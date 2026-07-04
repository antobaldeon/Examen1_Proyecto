export interface Inventory {
  id: number;
  productId: number;
  productName?: string;
  stockActual: number;
  stockMinimo: number;
  ubicacion: string;
  estado?: string;
  fechaActualizacion?: string;
}

export interface InventoryRequest {
  productId: number;
  stockActual: number;
  stockMinimo: number;
  ubicacion: string;
}
