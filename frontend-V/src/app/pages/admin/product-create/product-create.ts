import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, of, switchMap } from 'rxjs';
import { InventoryRequest } from '../../../models/inventory.model';
import { ProductRequest } from '../../../models/product.model';
import { InventoryService } from '../../../services/inventory';
import { ProductService } from '../../../services/product';

interface LocalPreview {
  file: File;
  url: string;
}

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css'
})
export class ProductCreateComponent implements OnDestroy {
  producto: ProductRequest = {
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: 0,
    codigo: this.generarCodigo(),
    estado: 'ACTIVO',
    imagenUrl: '',
    imagenesUrls: []
  };

  inventario = {
    stockActual: 10,
    stockMinimo: 3,
    ubicacion: 'Almacen principal'
  };

  imagenes: LocalPreview[] = [];
  guardando = false;
  error = '';

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.imagenes.forEach((image) => URL.revokeObjectURL(image.url));
  }

  get vistaPrevia(): string {
    return this.imagenes[0]?.url ?? '';
  }

  get nombresArchivos(): string {
    return this.imagenes.map((image) => image.file.name).join(', ');
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.error = '';

    if (files.length === 0) return;
    if (this.imagenes.length + files.length > 6) {
      this.error = 'Puedes subir hasta 6 imagenes por producto.';
      input.value = '';
      return;
    }

    const invalid = files.find((file) => !file.type.startsWith('image/'));
    if (invalid) {
      this.error = 'Selecciona solo imagenes JPG, PNG o WebP.';
      input.value = '';
      return;
    }

    const tooLarge = files.find((file) => file.size > 8 * 1024 * 1024);
    if (tooLarge) {
      this.error = 'Cada imagen no puede superar 8 MB.';
      input.value = '';
      return;
    }

    this.imagenes = [
      ...this.imagenes,
      ...files.map((file) => ({ file, url: URL.createObjectURL(file) }))
    ];
    this.producto.imagenUrl = '';
    this.producto.imagenesUrls = [];
    input.value = '';
  }

  quitarImagen(index: number): void {
    const image = this.imagenes[index];
    if (image) {
      URL.revokeObjectURL(image.url);
    }
    this.imagenes = this.imagenes.filter((_, currentIndex) => currentIndex !== index);
  }

  regenerarCodigo(): void {
    this.producto.codigo = this.generarCodigo();
  }

  guardar(): void {
    this.error = '';
    if (!this.formularioValido()) {
      this.error = 'Completa todos los campos obligatorios.';
      return;
    }

    this.guardando = true;
    const upload$ = this.imagenes.length > 0
      ? this.productService.uploadImages(this.imagenes.map((image) => image.file))
      : of([]);

    upload$
      .pipe(
        switchMap((images) => {
          const urls = images.map((image) => image.imageUrl).filter(Boolean);
          this.producto.imagenesUrls = urls;
          this.producto.imagenUrl = urls[0] ?? '';
          return this.productService.create(this.producto);
        }),
        switchMap((productId) => {
          const inventory: InventoryRequest = { productId, ...this.inventario };
          return this.inventoryService.create(inventory);
        }),
        finalize(() => (this.guardando = false))
      )
      .subscribe({
        next: () => void this.router.navigate(['/products']),
        error: (error: unknown) => {
          this.error = this.mensajeError(error);
        }
      });
  }

  private generarCodigo(): string {
    const random = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().slice(0, 6);
    return `ITM-${random.padEnd(6, '0')}`;
  }

  private formularioValido(): boolean {
    return Boolean(
      this.producto.nombre.trim() &&
        this.producto.descripcion.trim() &&
        this.producto.categoria.trim() &&
        this.producto.codigo.trim() &&
        this.producto.precio >= 0 &&
        this.inventario.stockActual >= 0 &&
        this.inventario.stockMinimo >= 0 &&
        this.inventario.ubicacion.trim()
    );
  }

  private mensajeError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return error instanceof Error
        ? `No se pudo guardar. ${error.message}`
        : 'No se pudo guardar. Error desconocido.';
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el API Gateway. Revisa que api-gateway este activo.';
    }
    if (error.url?.includes('/inventory') && (error.status === 503 || error.status === 504)) {
      return 'El producto se creo, pero inventario no respondio. Reinicia inventory-service y revisa que pueda consultar product-service en localhost:8084.';
    }
    if (error.url?.includes('/inventory')) {
      return 'El producto se creo, pero no se pudo crear su inventario inicial.';
    }
    if (error.url?.includes('/images') && (error.status === 503 || error.status === 504)) {
      return 'El gateway corto la subida de imagen. Reinicia api-gateway para cargar la ruta especial de imagenes.';
    }
    if (error.url?.includes('/images')) {
      return 'No se pudo subir la imagen a Google Drive. Revisa credenciales, carpeta compartida y Drive API.';
    }
    if (error.status === 401 || error.status === 403) {
      return 'Tu sesion no tiene permiso de administrador o expiro. Vuelve a iniciar sesion.';
    }
    if (error.status === 409 || error.status === 500) {
      return 'No se pudo guardar. Puede ser codigo repetido, Drive mal configurado o un servicio caido.';
    }
    return `No se pudo guardar. Error ${error.status}.`;
  }
}
