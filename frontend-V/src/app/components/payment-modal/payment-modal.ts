import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment';
import { PaymentRequest, PaymentResponse } from '../../models/payment.model';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-payment-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-modal.html',
  styleUrl: './payment-modal.css'
})
export class PaymentModalComponent {
  @Input() orderId: number | null = null;
  @Input() montoTotal: number = 0;
  @Input() subtotal: number = 0;
  @Input() igv: number = 0;
  @Output() cerrar = new EventEmitter<void>();
  @Output() pagoExitoso = new EventEmitter<void>();

  pagoConfirmadoOk = false;
  enviando = false;
  errorPago: string | null = null;
  pagoData: PaymentResponse | null = null;

  datos = {
    nombreCompleto: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    codigoSeguridad: '',
    numeroTelefono: '',
    correoElectronico: '',
    direccion: '',
    city: ''
  };

  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService
  ) {}

  confirmarPago(): void {
    if (!this.orderId || this.enviando || this.pagoConfirmadoOk) return;

    this.enviando = true;
    this.errorPago = null;

    const request: PaymentRequest = {
      orderId: this.orderId,
      monto: this.montoTotal,
      ...this.datos
    };

    this.paymentService.processPayment(request).subscribe({
      next: (response) => {
        this.pagoData = response;
        this.enviando = false;
        this.pagoConfirmadoOk = true;
      },
      error: (err) => {
        console.error(err);
        if (err?.status === 409 || err?.status === 504 || err?.status === 0) {
          this.cargarPagoExistente();
          return;
        }

        this.enviando = false;
        this.errorPago = err?.error?.message ?? 'No se pudo procesar el pago. Intenta nuevamente.';
      }
    });
  }

  private cargarPagoExistente(): void {
    if (!this.orderId) return;

    window.setTimeout(() => {
      if (!this.orderId) return;

      this.paymentService.getByOrderId(this.orderId).subscribe({
        next: (response) => {
          this.pagoData = response;
          this.enviando = false;
          this.errorPago = null;
          this.pagoConfirmadoOk = true;
        },
        error: (err) => {
          console.error(err);
          this.verificarOrdenPagada();
        }
      });
    }, 900);
  }

  private verificarOrdenPagada(): void {
    if (!this.orderId) return;

    this.orderService.getById(this.orderId).subscribe({
      next: (order) => {
        this.enviando = false;

        if (order.estado === 'PAGADA' || order.estado === 'COMPLETADA') {
          this.pagoData = {
            id: 0,
            orderId: order.id,
            monto: order.total,
            nombreCompleto: order.usuarioNombre,
            correoElectronico: order.usuarioEmail,
            fechaPago: order.fecha,
            estado: 'EXITOSO'
          };
          this.errorPago = null;
          this.pagoConfirmadoOk = true;
          return;
        }

        this.errorPago = 'No se pudo procesar el pago. Intenta nuevamente.';
      },
      error: (err) => {
        console.error(err);
        this.enviando = false;
        this.errorPago = 'No se pudo confirmar el pago. Revisa tus pedidos antes de intentar nuevamente.';
      }
    });
  }

  volverAlCarrito(): void {
    this.cerrar.emit();
  }

  cerrarTodo(): void {
    this.pagoExitoso.emit();
  }
}
