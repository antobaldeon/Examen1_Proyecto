import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, concatMap, from, map, toArray } from 'rxjs';
import { ImageUploadResponse, Product, ProductRequest } from '../models/product.model';
import { API_URL } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = `${API_URL}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.baseUrl)
      .pipe(map((products) => products.map((product) => this.normalizeProduct(product))));
  }

  getById(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${this.baseUrl}/${id}`)
      .pipe(map((product) => this.normalizeProduct(product)));
  }

  uploadImage(file: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageUploadResponse>(`${this.baseUrl}/images`, formData).pipe(
      map((response) => ({
        ...response,
        imageUrl: this.toEmbeddableDriveUrl(response.imageUrl)
      }))
    );
  }

  uploadImages(files: File[]): Observable<ImageUploadResponse[]> {
    return from(files).pipe(
      concatMap((file) => this.uploadImage(file)),
      toArray()
    );
  }

  create(product: ProductRequest): Observable<number> {
    return this.http.post<Product>(this.baseUrl, product).pipe(
      map((response) => {
        const productId = Number(response.id);
        if (!Number.isFinite(productId) || productId <= 0) {
          throw new Error('El backend no devolvio el ID del producto.');
        }
        return productId;
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private normalizeProduct(product: Product): Product {
    const images = (product.imagenesUrls ?? [])
      .map((image) => this.toEmbeddableDriveUrl(image))
      .filter(Boolean);
    const imageUrl = this.toEmbeddableDriveUrl(product.imagenUrl ?? images[0] ?? '');

    return {
      ...product,
      imagenUrl: imageUrl || undefined,
      imagenesUrls: images.length > 0 ? images : imageUrl ? [imageUrl] : []
    };
  }

  private toEmbeddableDriveUrl(url: string): string {
    if (!url) return '';

    const fileId = this.googleDriveFileIdFrom(url);
    if (!fileId) return url;

    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1200`;
  }

  private googleDriveFileIdFrom(url: string): string {
    try {
      const parsedUrl = new URL(url);
      if (!parsedUrl.hostname.includes('drive.google.com')) return '';

      const id = parsedUrl.searchParams.get('id');
      if (id) return id;

      const filePathMatch = parsedUrl.pathname.match(/\/file\/d\/([^/]+)/);
      return filePathMatch?.[1] ?? '';
    } catch {
      const idMatch = url.match(/[?&]id=([^&]+)/);
      if (idMatch?.[1]) return decodeURIComponent(idMatch[1]);

      const filePathMatch = url.match(/\/file\/d\/([^/]+)/);
      return filePathMatch?.[1] ?? '';
    }
  }
}
