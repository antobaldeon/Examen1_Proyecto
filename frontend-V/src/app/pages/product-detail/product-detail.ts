import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  selectedImage = '';
  cantidad = 1;
  loading = true;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.error = 'Producto no encontrado.';
      this.loading = false;
      return;
    }

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = this.images[0] ?? '';
        this.loading = false;
      },
      error: () => {
        this.error = 'No pudimos cargar el producto.';
        this.loading = false;
      }
    });
  }

  get images(): string[] {
    const images = this.product?.imagenesUrls?.filter(Boolean) ?? [];
    if (images.length > 0) return images;
    return this.product?.imagenUrl ? [this.product.imagenUrl] : [];
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  addToCart(): void {
    if (!this.product) return;
    if (!this.authService.isLoggedIn()) {
      void this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(this.product, this.cantidad);
    this.message = 'Producto agregado al carrito.';
    window.setTimeout(() => (this.message = ''), 2200);
  }
}
