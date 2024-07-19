import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  orderDate: string;
  customerName: string;
  totalAmount: number;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  productName: string;
  quantity: number;
  unitPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5063/api/orders'; // Ensure this URL is correct

  constructor(private http: HttpClient) { }
  
  saveOrder(order: Order): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept-Language': 'en' });
    return this.http.post(this.apiUrl, order, { headers });
  }
}
