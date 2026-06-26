import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest, PaymentResponse } from '../models/payment.model';
import { API_URL } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = `${API_URL}/payments`;

  constructor(private http: HttpClient) {}

  processPayment(payment: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.baseUrl, payment);
  }
}
