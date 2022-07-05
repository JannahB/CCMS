import { Injectable, forwardRef, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import { Observable } from 'rxjs/Observable';
import { OrderTemplate } from '../../entities/OrderTemplate';
import { Order } from '../../entities/Order';

@Injectable()
export class OrderService extends HttpBaseService<OrderTemplate> {

  constructor(
    @Inject(forwardRef(() => HttpClient)) protected http: HttpClient,
    @Inject(forwardRef(() => Http)) protected classicHttp: Http
  ) {
    super(http);
  }

  public getOrderTemplates(): Observable<OrderTemplate[]> {
    const url = `${super.getBaseUrl()}/api/traffic-orders`;
    return this.http
      .get<OrderTemplate[]>(url)
      .map(res => {
        const orderTemplates: OrderTemplate[] = res;
        return orderTemplates;
      });
  }

  public getOrdersByOffence(offenceNumber: string | number): Observable<Order[]> {
    const url = `${super.getBaseUrl()}/api/retrieve-orders/${offenceNumber}`;
    return this.http
      .get<Order[]>(url)
      .map(result => {
        const orders: Order[] = result;
        return orders;
      });
  }

  public save(order: Order): Observable<Order> {
    const url = `${super.getBaseUrl()}/api/uturn-orders/`;
    if (order.id > 0) {
      return this.http.put<Order>(url, order);
    } else {
      order.id = null;
      return this.http.post<Order>(url, order);
    }
  }

  public send(uturnOrder: any): Observable<any> {
    const url = `${super.getBaseUrl()}/SendUturnOrder`;
    return this.http.post<any>(url, uturnOrder);
  }

  

  // , { headers: { Authorization: "Basic" + this.authToken }}

}
