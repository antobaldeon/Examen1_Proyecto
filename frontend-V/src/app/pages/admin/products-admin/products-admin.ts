import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../models/categoria.model';
import { Product, ProductRequest } from '../../../models/product.model';
import { CategoriaService } from '../../../services/categoria';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-products-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products-admin.html',
  styleUrl: './products-admin.css'
})
export class ProductsAdminComponent implements OnInit {
  productos: Product[] = [];
  categorias: Categoria[] = [];

  cargando = false;
  guardando = false;
  error: string | null = null;
  mensaje: string | null = null;

  productoEditando: Product | null = null;
  formulario: ProductRequest = this.formularioVacio();

  constructor(
    private productService: ProductService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = null;

    this.categoriaService.getActivas().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: () => {
        this.error = 'No se pudieron cargar las categorias.';
      }
    });

    this.productService.getAll().subscribe({
      next: (productos) => {
        this.productos = [...productos].sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }
    });
  }

  editar(producto: Product): void {
    this.productoEditando = producto;
    this.error = null;
    this.mensaje = null;
    this.formulario = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      precio: producto.precio,
      codigo: producto.codigo,
      estado: producto.estado,
      imagenUrl: producto.imagenUrl || ''
    };
  }

  cerrarEdicion(): void {
    this.productoEditando = null;
    this.formulario = this.formularioVacio();
  }

  guardarEdicion(): void {
    if (!this.productoEditando) return;

    if (!this.formulario.nombre.trim() || !this.formulario.descripcion.trim() || !this.formulario.categoria.trim()) {
      this.error = 'Completa nombre, descripcion y categoria.';
      return;
    }

    this.guardando = true;
    this.error = null;
    this.mensaje = null;

    const request: ProductRequest = {
      ...this.formulario,
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion.trim(),
      categoria: this.formulario.categoria.trim(),
      codigo: this.productoEditando.codigo,
      precio: Number(this.formulario.precio)
    };

    this.productService.update(this.productoEditando.id, request).subscribe({
      next: () => {
        this.mensaje = 'Producto actualizado.';
        this.guardando = false;
        this.cerrarEdicion();
        this.cargarDatos();
      },
      error: () => {
        this.error = 'No se pudo actualizar el producto.';
        this.guardando = false;
      }
    });
  }

  eliminar(producto: Product): void {
    const confirmado = confirm(`Eliminar ${producto.nombre}?`);
    if (!confirmado) return;

    this.productService.delete(producto.id).subscribe({
      next: () => {
        this.mensaje = 'Producto eliminado.';
        this.cargarDatos();
      },
      error: () => {
        this.error = 'No se pudo eliminar el producto.';
      }
    });
  }

  claseEstado(estado: string): string {
    return estado === 'ACTIVO' ? 'success' : 'secondary';
  }

  private formularioVacio(): ProductRequest {
    return {
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: 0,
      codigo: '',
      estado: 'ACTIVO',
      imagenUrl: ''
    };
  }
}
