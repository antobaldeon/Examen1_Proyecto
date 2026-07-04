import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Inventory } from '../../../models/inventory.model';
import { OrderResponse } from '../../../models/order.model';
import { PaymentResponse } from '../../../models/payment.model';
import { Product } from '../../../models/product.model';
import { InventoryService } from '../../../services/inventory';
import { OrderService } from '../../../services/order';
import { PaymentService } from '../../../services/payment';
import { ProductService } from '../../../services/product';

type AdminTab = 'reportes' | 'productos' | 'inventario' | 'ordenes';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  tab: AdminTab = 'reportes';

  productos: Product[] = [];
  productosFiltrados: Product[] = [];

  inventario: Inventory[] = [];
  inventarioFiltrado: Inventory[] = [];

  ordenes: OrderResponse[] = [];
  ordenesFiltradas: OrderResponse[] = [];

  pagos = new Map<number, PaymentResponse | null>();

  detalleOrdenId: number | null = null;

  busqueda = '';
  categoriaActiva = 'Todos';

  busquedaInventario = '';
  filtroStock = 'Todos';

  busquedaOrdenes = '';
  filtroEstadoOrden = 'Todos';

  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private orderService: OrderService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.cargarTodo();
  }

  get categorias(): string[] {
    return ['Todos', ...new Set(this.productos.map((p) => p.categoria).filter(Boolean))];
  }

  get estadosOrden(): string[] {
    return ['Todos', ...new Set(this.ordenes.map((o) => o.estado).filter(Boolean))];
  }

  get cantidadProductos(): number {
    return this.productos.length;
  }

  get ordenesRecientes(): OrderResponse[] {
    return this.ordenes.slice(0, 5);
  }

  get ventasTotales(): number {
    return this.ordenes
      .filter((orden) => orden.estado === 'PAGADA')
      .reduce((total, orden) => total + orden.total, 0);
  }

  get pagosRealizados(): number {
    return this.ordenes.filter((orden) => orden.estado === 'PAGADA').length;
  }

  get productosStockBajo(): Inventory[] {
    return this.inventario.filter((item) => item.stockActual <= 5);
  }

  cargarTodo(): void {
    this.cargando = true;
    this.error = '';

    this.productService.getAll().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.aplicarFiltrosProductos();
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar productos.';
        this.cargando = false;
      }
    });

    this.inventoryService.getAll().subscribe({
      next: (inventario) => {
        this.inventario = [...inventario].sort((a, b) => a.stockActual - b.stockActual);
        this.aplicarFiltrosInventario();
      },
      error: () => {
        this.error = 'No se pudo cargar inventario.';
      }
    });

    this.orderService.getAll().subscribe({
      next: (ordenes) => {
        this.ordenes = [...ordenes].sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.aplicarFiltrosOrdenes();
      },
      error: () => {
        this.error = 'No se pudo cargar ordenes.';
      }
    });
  }

  aplicarFiltrosProductos(): void {
    const termino = this.busqueda.trim().toLowerCase();

    this.productosFiltrados = this.productos.filter((producto) => {
      const coincideCategoria =
        this.categoriaActiva === 'Todos' || producto.categoria === this.categoriaActiva;

      const coincideTexto =
        !termino ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.codigo.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino);

      return coincideCategoria && coincideTexto;
    });
  }

  aplicarFiltrosInventario(): void {
    const termino = this.busquedaInventario.trim().toLowerCase();

    this.inventarioFiltrado = this.inventario.filter((item) => {
      const nombre = item.productName ?? String(item.productId);
      const coincideTexto =
        !termino ||
        nombre.toLowerCase().includes(termino) ||
        item.ubicacion.toLowerCase().includes(termino) ||
        String(item.productId).includes(termino);

      const coincideStock =
        this.filtroStock === 'Todos' ||
        (this.filtroStock === 'Bajo' && item.stockActual <= 5) ||
        (this.filtroStock === 'SinStock' && item.stockActual === 0) ||
        (this.filtroStock === 'Disponible' && item.stockActual > 5);

      return coincideTexto && coincideStock;
    });
  }

  aplicarFiltrosOrdenes(): void {
    const termino = this.busquedaOrdenes.trim().toLowerCase();

    this.ordenesFiltradas = this.ordenes.filter((orden) => {
      const coincideTexto =
        !termino ||
        String(orden.id).includes(termino) ||
        (orden.codigo ?? '').toLowerCase().includes(termino) ||
        (orden.usuarioNombre ?? '').toLowerCase().includes(termino) ||
        (orden.usuarioEmail ?? '').toLowerCase().includes(termino);

      const coincideEstado =
        this.filtroEstadoOrden === 'Todos' || orden.estado === this.filtroEstadoOrden;

      return coincideTexto && coincideEstado;
    });
  }

  cambiarTab(tab: AdminTab): void {
    this.tab = tab;
  }

  eliminarProducto(producto: Product): void {
    if (!confirm(`Eliminar "${producto.nombre}" del catalogo?`)) return;

    this.productService.delete(producto.id).subscribe({
      next: () => {
        this.mostrarMensaje('Producto eliminado.');
        this.cargarTodo();
      },
      error: () => {
        this.error = 'No se pudo eliminar. Puede tener movimientos asociados.';
      }
    });
  }

  agregarStock(item: Inventory): void {
    const valor = prompt(`Cantidad a agregar para ${item.productName ?? 'producto'}:`, '1');
    const cantidad = Number(valor);

    if (!Number.isFinite(cantidad) || cantidad <= 0) return;

    this.inventoryService.addStock(item.productId, cantidad).subscribe({
      next: () => {
        this.mostrarMensaje('Stock actualizado.');
        this.cargarTodo();
      },
      error: () => {
        this.error = 'No se pudo actualizar el stock.';
      }
    });
  }

  restarStock(item: Inventory): void {
    const valor = prompt(`Cantidad a restar para ${item.productName ?? 'producto'}:`, '1');
    const cantidad = Number(valor);

    if (!Number.isFinite(cantidad) || cantidad <= 0) return;

    this.inventoryService.subtractStock(item.productId, cantidad).subscribe({
      next: () => {
        this.mostrarMensaje('Stock actualizado.');
        this.cargarTodo();
      },
      error: () => {
        this.error = 'No se pudo restar stock. Verifica la cantidad disponible.';
      }
    });
  }

  verDetalleOrden(orden: OrderResponse): void {
    this.detalleOrdenId = this.detalleOrdenId === orden.id ? null : orden.id;

    if (!this.pagos.has(orden.id)) {
      this.paymentService.getByOrderId(orden.id).subscribe({
        next: (pago) => this.pagos.set(orden.id, pago),
        error: () => this.pagos.set(orden.id, null)
      });
    }
  }

  cancelarOrden(orden: OrderResponse): void {
    if (orden.estado === 'CANCELADA') return;
    if (!confirm(`Cancelar la orden ${orden.codigo || orden.id}?`)) return;

    this.orderService.cancel(orden.id).subscribe({
      next: () => {
        this.mostrarMensaje('Orden cancelada.');
        this.cargarTodo();
      },
      error: () => {
        this.error = 'No se pudo cancelar la orden.';
      }
    });
  }

  pagoDe(orderId: number): PaymentResponse | null | undefined {
    return this.pagos.get(orderId);
  }

  private mostrarMensaje(mensaje: string): void {
    this.mensaje = mensaje;
    window.setTimeout(() => (this.mensaje = ''), 2600);
  }
}
