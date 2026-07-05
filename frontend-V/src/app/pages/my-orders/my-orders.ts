import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OrderResponse } from '../../models/order.model';
import { AuthService } from '../../services/auth';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrdersComponent implements OnInit {
  ordenes: OrderResponse[] = [];
  ordenSeleccionada: OrderResponse | null = null;
  cargando = false;
  cargandoDetalle = false;
  error: string | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.getRol() === 'ADMIN') {
      void this.router.navigate(['/admin']);
      return;
    }

    this.cargarPedidos();
  }

  cargarPedidos(): void {
    const usuarioId = this.authService.getUserId();

    if (!usuarioId) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/my-orders' } });
      return;
    }

    this.cargando = true;
    this.error = null;

    this.orderService.getByUsuarioId(usuarioId).subscribe({
      next: (ordenes) => {
        this.ordenes = ordenes;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar tus pedidos.';
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
        this.error = 'No se pudo cargar el detalle del pedido.';
        this.cargandoDetalle = false;
      }
    });
  }

  cerrarDetalle(): void {
    this.ordenSeleccionada = null;
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

  formatearFecha(fecha: string): string {
    const date = this.parseFecha(fecha);
    if (!date) return 'Fecha no disponible';

    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatearHora(fecha: string): string {
    const date = this.parseFecha(fecha);
    if (!date) return '--:--';

    return date.toLocaleTimeString('es-PE', {
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
