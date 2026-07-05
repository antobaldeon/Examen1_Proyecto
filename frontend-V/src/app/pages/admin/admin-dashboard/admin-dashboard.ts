import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';
import { Inventory } from '../../../models/inventory.model';
import { OrderResponse } from '../../../models/order.model';
import { Product } from '../../../models/product.model';
import { InventoryService } from '../../../services/inventory';
import { OrderService } from '../../../services/order';
import { ProductService } from '../../../services/product';
import { UsuarioService } from '../../../services/usuario';
import { CategoriaService } from '../../../services/categoria';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  productos: Product[] = [];
  ordenes: OrderResponse[] = [];
  inventario: Inventory[] = [];

  cargando = true;
  error: string | null = null;

  cantidadProductos = 0;
  ventasTotales = 0;
  pagosRealizados = 0;
  productosStockBajo: Inventory[] = [];
  ordenesRecientes: OrderResponse[] = [];

  fechaActual: Date = new Date();

  cantidadOrdenes = 0;
  clientesRegistrados = 0;
  categoriasActivas = 0;
  crecimientoMensual = 0;

  private ventasPorMesLabels: string[] = [];
  private ventasPorMesData: number[] = [];

  private ventasPorCategoriaLabels: string[] = [];
  private ventasPorCategoriaData: number[] = [];

  @ViewChild('ventasChart') ventasChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriaChart') categoriaChartRef?: ElementRef<HTMLCanvasElement>;

  private graficoVentas?: Chart;
  private graficoCategorias?: Chart;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private inventoryService: InventoryService,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  ngOnDestroy(): void {
    this.graficoVentas?.destroy();
    this.graficoCategorias?.destroy();
  }

  get fechaFormateada(): string {
    return this.fechaActual.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  cargarDashboard(): void {
    this.cargando = true;
    this.error = null;

    forkJoin({
      productos: this.productService.getAll(),
      ordenes: this.orderService.getAll(),
      inventario: this.inventoryService.getAll(),
      usuarios: this.usuarioService.getAll(),
      categorias: this.categoriaService.getActivas()
    }).subscribe({
      next: ({ productos, ordenes, inventario, usuarios, categorias }) => {
        this.productos = productos;
        this.ordenes = ordenes;
        this.inventario = inventario;

        this.cantidadProductos = productos.length;
        this.cantidadOrdenes = ordenes.length;
        this.clientesRegistrados = usuarios.filter((usuario) => usuario.rol === 'CLIENTE').length;
        this.categoriasActivas = categorias.length;

        this.pagosRealizados = ordenes.filter((orden) => orden.estado === 'PAGADA').length;

        this.ventasTotales = ordenes
          .filter((orden) => orden.estado === 'PAGADA')
          .reduce((total, orden) => total + orden.total, 0);

        this.productosStockBajo = inventario
          .filter((item) => item.stockActual <= item.stockMinimo)
          .slice(0, 5);

        this.ordenesRecientes = [...ordenes]
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .slice(0, 5);

        this.calcularVentasPorMes(ordenes);
        this.calcularVentasPorCategoria(ordenes, productos);
        this.calcularCrecimientoMensual(ordenes);

        this.cargando = false;
        this.cdr.detectChanges();
        this.inicializarGraficos();
      },
      error: () => {
        this.error = 'No se pudo cargar el dashboard administrativo.';
        this.cargando = false;
      }
    });
  }

  nombreProducto(productId: number): string {
    return this.productos.find((producto) => producto.id === productId)?.nombre ?? `Producto #${productId}`;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  claseEstadoOrden(estado: string): string {
    switch (estado) {
      case 'PAGADA':
        return 'text-bg-success';
      case 'PENDIENTE':
        return 'text-bg-warning';
      case 'CANCELADA':
        return 'text-bg-danger';
      default:
        return 'text-bg-secondary';
    }
  }

  private calcularVentasPorMes(ordenes: OrderResponse[]): void {
    const ventasPorMes = new Map<string, number>();

    ordenes
      .filter((orden) => orden.estado === 'PAGADA')
      .forEach((orden) => {
        const fecha = new Date(orden.fecha);
        if (Number.isNaN(fecha.getTime())) return;

        const claveMes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        ventasPorMes.set(claveMes, (ventasPorMes.get(claveMes) ?? 0) + orden.total);
      });

    const ultimosMeses = [...ventasPorMes.entries()]
      .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
      .slice(-6);

    this.ventasPorMesLabels = ultimosMeses.map(([claveMes]) => {
      const [anio, mes] = claveMes.split('-').map(Number);
      return new Date(anio, mes - 1, 1).toLocaleDateString('es-PE', {
        month: 'short',
        year: 'numeric'
      });
    });

    this.ventasPorMesData = ultimosMeses.map(([, total]) => Number(total.toFixed(2)));
  }

  private calcularVentasPorCategoria(ordenes: OrderResponse[], productos: Product[]): void {
    const categoriaPorProducto = new Map<number, string>();

    productos.forEach((producto) => {
      categoriaPorProducto.set(producto.id, producto.categoria || 'Sin categoria');
    });

    const ventasPorCategoria = new Map<string, number>();

    ordenes
      .filter((orden) => orden.estado === 'PAGADA')
      .forEach((orden) => {
        orden.detalles.forEach((detalle) => {
          const categoria = categoriaPorProducto.get(detalle.productId) ?? 'Sin categoria';
          const subtotalDetalle = detalle.subtotal ?? detalle.cantidad * detalle.precioUnitario;
          ventasPorCategoria.set(categoria, (ventasPorCategoria.get(categoria) ?? 0) + subtotalDetalle);
        });
      });

    const categoriasOrdenadas = [...ventasPorCategoria.entries()]
      .sort(([, totalA], [, totalB]) => totalB - totalA);

    this.ventasPorCategoriaLabels = categoriasOrdenadas.map(([categoria]) => categoria);
    this.ventasPorCategoriaData = categoriasOrdenadas.map(([, total]) => Number(total.toFixed(2)));
  }

  private calcularCrecimientoMensual(ordenes: OrderResponse[]): void {
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    const fechaMesAnterior = new Date(anioActual, mesActual - 1, 1);
    const mesAnterior = fechaMesAnterior.getMonth();
    const anioMesAnterior = fechaMesAnterior.getFullYear();

    const ventasMesActual = this.totalVentasDelMes(ordenes, anioActual, mesActual);
    const ventasMesAnterior = this.totalVentasDelMes(ordenes, anioMesAnterior, mesAnterior);

    if (ventasMesAnterior === 0) {
      this.crecimientoMensual = ventasMesActual > 0 ? 100 : 0;
      return;
    }

    this.crecimientoMensual = Number(
      (((ventasMesActual - ventasMesAnterior) / ventasMesAnterior) * 100).toFixed(1)
    );
  }

  private totalVentasDelMes(ordenes: OrderResponse[], anio: number, mes: number): number {
    return ordenes
      .filter((orden) => orden.estado === 'PAGADA')
      .filter((orden) => {
        const fecha = new Date(orden.fecha);
        return fecha.getFullYear() === anio && fecha.getMonth() === mes;
      })
      .reduce((total, orden) => total + orden.total, 0);
  }

  private inicializarGraficos(): void {
    this.crearGraficoVentas();
    this.crearGraficoCategorias();
  }

  private crearGraficoVentas(): void {
    if (!this.ventasChartRef) return;

    this.graficoVentas?.destroy();

    this.graficoVentas = new Chart(this.ventasChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.ventasPorMesLabels,
        datasets: [
          {
            label: 'Ventas (S/)',
            data: this.ventasPorMesData,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.12)',
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#2563eb'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#eef0f3' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  private crearGraficoCategorias(): void {
    if (!this.categoriaChartRef) return;

    this.graficoCategorias?.destroy();

    const colores = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#6b7280'];

    this.graficoCategorias = new Chart(this.categoriaChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.ventasPorCategoriaLabels,
        datasets: [
          {
            label: 'Ventas por categoria (S/)',
            data: this.ventasPorCategoriaData,
            backgroundColor: colores,
            borderRadius: 6,
            maxBarThickness: 42
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#eef0f3' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}