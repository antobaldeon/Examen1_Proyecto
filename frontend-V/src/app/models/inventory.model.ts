export interface Inventory {
  id: number;
  productId: number;
  stockActual: number;
  stockMinimo: number;
  ubicacion: string;
  fechaActualizacion?: string;
}

export interface InventoryRequest {
  productId: number;
  stockActual: number;
  stockMinimo: number;
  ubicacion: string;
}
