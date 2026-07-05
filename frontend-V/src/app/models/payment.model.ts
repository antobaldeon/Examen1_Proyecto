export interface PaymentRequest {
  orderId: number;
  monto: number;
  nombreCompleto: string;
  numeroTarjeta: string;
  fechaExpiracion: string;
  codigoSeguridad: string;
  numeroTelefono: string;
  correoElectronico: string;
  direccion: string;
  city: string;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  monto: number;
  nombreCompleto: string;
  correoElectronico: string;
  fechaPago: string;
  estado: string;
}