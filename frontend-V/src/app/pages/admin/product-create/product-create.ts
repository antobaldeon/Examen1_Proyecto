import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, of, switchMap } from 'rxjs';
import { InventoryRequest } from '../../../models/inventory.model';
import { ProductRequest } from '../../../models/product.model';
import { InventoryService } from '../../../services/inventory';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css'
})
export class ProductCreateComponent implements OnInit {
  productId: number | null = null;

  producto: ProductRequest = {
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: 0,
    estado: 'ACTIVO',
    imagenUrl: ''
  };

  inventario = {
    stockActual: 10,
    stockMinimo: 3,
    ubicacion: 'Almacen principal'
  };

  vistaPrevia = '';
  nombreArchivo = '';
  guardando = false;
  error = '';

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isFinite(id) && id > 0) {
      this.productId = id;

      this.productService.getById(id).subscribe({
        next: (producto) => {
          this.producto = {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            categoria: producto.categoria,
            precio: producto.precio,
            estado: producto.estado,
            imagenUrl: producto.imagenUrl
          };

          this.vistaPrevia = producto.imagenUrl ?? '';
        },
        error: () => {
          this.error = 'No se pudo cargar el producto.';
        }
      });

      this.inventoryService.getByProductId(id).subscribe({
        next: (inventory) => {
          this.inventario = {
            stockActual: inventory.stockActual,
            stockMinimo: inventory.stockMinimo,
            ubicacion: inventory.ubicacion
          };
        }
      });
    }
  }

  get modoEdicion(): boolean {
    return this.productId !== null;
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.error = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error = 'Selecciona una imagen JPG, PNG o WebP.';
      input.value = '';
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      this.error = 'La imagen original no puede superar 8 MB.';
      input.value = '';
      return;
    }

    this.nombreArchivo = file.name;

    const reader = new FileReader();
    reader.onload = () => this.optimizarImagen(String(reader.result));
    reader.readAsDataURL(file);
  }

  quitarImagen(): void {
    this.vistaPrevia = '';
    this.nombreArchivo = '';
    this.producto.imagenUrl = '';
  }

  guardar(): void {
    this.error = '';

    if (!this.formularioValido()) {
      this.error = 'Completa todos los campos obligatorios.';
      return;
    }

    this.guardando = true;

    const save$ = this.productId
      ? this.productService.update(this.productId, this.producto)
      : this.productService.create(this.producto);

    save$
      .pipe(
        switchMap((product) => {
          if (this.productId) return of(null);

          const inventory: InventoryRequest = {
            productId: product.id,
            ...this.inventario
          };

          return this.inventoryService.create(inventory);
        }),
        finalize(() => (this.guardando = false))
      )
      .subscribe({
        next: () => void this.router.navigate(['/admin']),
        error: (err) => {
          this.error = err?.error?.message ?? 'No se pudo guardar. Revisa que los servicios esten activos.';
        }
      });
  }

  private optimizarImagen(dataUrl: string): void {
    const image = new Image();

    image.onload = () => {
      const maxSize = 800;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      const context = canvas.getContext('2d');

      if (!context) {
        this.error = 'No se pudo procesar la imagen.';
        return;
      }

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const optimized = canvas.toDataURL('image/webp', 0.72);

      if (optimized.length > 500_000) {
        this.error = 'La imagen sigue siendo demasiado pesada. Usa una fotografia mas pequena.';
        this.quitarImagen();
        return;
      }

      this.vistaPrevia = optimized;
      this.producto.imagenUrl = optimized;
    };

    image.src = dataUrl;
  }

  private formularioValido(): boolean {
    return Boolean(
      this.producto.nombre.trim() &&
        this.producto.descripcion.trim() &&
        this.producto.categoria.trim() &&
        this.producto.precio >= 0 &&
        this.inventario.stockActual >= 0 &&
        this.inventario.stockMinimo >= 0 &&
        this.inventario.ubicacion.trim()
    );
  }
}
