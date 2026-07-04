import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment';
import { PaymentRequest, PaymentResponse } from '../../models/payment.model';

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

  constructor(private paymentService: PaymentService) {}

  confirmarPago(): void {
    if (!this.orderId) return;

    this.enviando = true;
    this.errorPago = null;

    const request: PaymentRequest = {
      orderId: this.orderId,
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
        this.enviando = false;
        this.errorPago = 'No se pudo procesar el pago. Revisa los datos o el stock disponible.';
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
