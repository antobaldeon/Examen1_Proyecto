import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Inventory, InventoryRequest } from '../../../models/inventory.model';
import { Product } from '../../../models/product.model';
import { InventoryService } from '../../../services/inventory';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-inventory-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inventory-admin.html',
  styleUrl: './inventory-admin.css'
})
export class InventoryAdminComponent implements OnInit {
  inventario: Inventory[] = [];
  productos: Product[] = [];

  cargando = false;
  guardando = false;
  error: string | null = null;
  mensaje: string | null = null;

  editandoId: number | null = null;

  formulario: InventoryRequest = {
    productId: 0,
    stockActual: 0,
    stockMinimo: 1,
    ubicacion: ''
  };

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = null;

    this.productService.getAll().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargarInventario();
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }
    });
  }

  cargarInventario(): void {
    this.inventoryService.getAll().subscribe({
      next: (inventario) => {
        this.inventario = inventario;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el inventario.';
        this.cargando = false;
      }
    });
  }

  guardar(): void {
    this.guardando = true;
    this.error = null;
    this.mensaje = null;

    const request: InventoryRequest = {
      productId: Number(this.formulario.productId),
      stockActual: Number(this.formulario.stockActual),
      stockMinimo: Number(this.formulario.stockMinimo),
      ubicacion: this.formulario.ubicacion.trim()
    };

    const operacion = this.editandoId
      ? this.inventoryService.update(this.editandoId, request)
      : this.inventoryService.create(request);

    operacion.subscribe({
      next: () => {
        this.mensaje = this.editandoId ? 'Inventario actualizado.' : 'Inventario registrado.';
        this.limpiarFormulario();
        this.cargarInventario();
        this.guardando = false;
      },
      error: () => {
        this.error = 'No se pudo guardar el inventario.';
        this.guardando = false;
      }
    });
  }

  editar(item: Inventory): void {
    this.editandoId = item.id;
    this.formulario = {
      productId: item.productId,
      stockActual: item.stockActual,
      stockMinimo: item.stockMinimo,
      ubicacion: item.ubicacion
    };
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Eliminar este registro de inventario?');
    if (!confirmado) return;

    this.inventoryService.delete(id).subscribe({
      next: () => {
        this.mensaje = 'Inventario eliminado.';
        this.cargarInventario();
      },
      error: () => {
        this.error = 'No se pudo eliminar el inventario.';
      }
    });
  }

  ajustarStock(item: Inventory, tipo: 'ENTRADA' | 'SALIDA'): void {
    const valor = prompt(tipo === 'ENTRADA' ? 'Cantidad a ingresar:' : 'Cantidad a retirar:');
    const cantidad = Number(valor);

    if (!Number.isFinite(cantidad) || cantidad <= 0) return;

    this.inventoryService.updateStock(item.productId, cantidad, tipo).subscribe({
      next: () => {
        this.mensaje = 'Stock actualizado.';
        this.cargarInventario();
      },
      error: () => {
        this.error = 'No se pudo actualizar el stock.';
      }
    });
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.formulario = {
      productId: 0,
      stockActual: 0,
      stockMinimo: 1,
      ubicacion: ''
    };
  }

  nombreProducto(item: Inventory): string {
    return item.productName || this.productos.find((producto) => producto.id === item.productId)?.nombre || `Producto #${item.productId}`;
  }

  codigoProducto(item: Inventory): string {
    return this.productos.find((producto) => producto.id === item.productId)?.codigo || '-';
  }

  estadoClase(item: Inventory): string {
    if (item.stockActual <= 0) return 'danger';
    if (item.stockActual <= item.stockMinimo) return 'warning';
    return 'success';
  }
}
