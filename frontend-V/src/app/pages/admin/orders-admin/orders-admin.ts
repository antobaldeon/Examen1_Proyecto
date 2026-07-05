import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderResponse } from '../../../models/order.model';
import { OrderService } from '../../../services/order';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders-admin.html',
  styleUrl: './orders-admin.css'
})
export class OrdersAdminComponent implements OnInit {
  ordenes: OrderResponse[] = [];
  ordenSeleccionada: OrderResponse | null = null;

  cargandoDetalle = false;

  cargando = false;
  error: string | null = null;
  mensaje: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes(): void {
    this.cargando = true;
    this.error = null;

    this.orderService.getAll().subscribe({
      next: (ordenes) => {
        this.ordenes = [...ordenes].sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las ordenes.';
        this.cargando = false;
      }
    });
  }

  abrirDetalle(orden: OrderResponse): void {
  this.cargandoDetalle = true;
  this.error = null;

  this.orderService.getById(orden.id).subscribe({
    next: (ordenDetalle) => {
      this.ordenSeleccionada = ordenDetalle;
      this.cargandoDetalle = false;
    },
    error: () => {
      this.error = 'No se pudo cargar el detalle de la orden.';
      this.cargandoDetalle = false;
    }
  });
}

  cerrarDetalle(): void {
    this.ordenSeleccionada = null;
  }

  cancelarOrden(orden: OrderResponse): void {
    if (orden.estado === 'CANCELADA') return;

    const confirmado = confirm(`¿Cancelar la orden #${orden.id}?`);
    if (!confirmado) return;

    this.orderService.cancelar(orden.id).subscribe({
      next: () => {
        this.mensaje = `Orden #${orden.id} cancelada.`;
        this.cargarOrdenes();
      },
      error: () => {
        this.error = 'No se pudo cancelar la orden.';
      }
    });
  }

  clienteOrden(orden: OrderResponse): string {
  return orden.usuarioNombre || orden.usuarioEmail || `Usuario #${orden.usuarioId}`;
}

  formatearFechaHora(fecha: string): string {
    const date = this.parseFecha(fecha);
    if (!date) return 'Fecha no disponible';

    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  claseEstado(estado: string): string {
    switch (estado) {
      case 'PAGADA':
      case 'COMPLETADA':
        return 'success';
      case 'PENDIENTE':
        return 'warning';
      case 'CANCELADA':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  private parseFecha(fecha: string): Date | null {
    if (!fecha) return null;

    const normalizada = fecha.includes('T') ? fecha : fecha.replace(' ', 'T');
    const date = new Date(normalizada);

    return Number.isNaN(date.getTime()) ? null : date;
  }
}
