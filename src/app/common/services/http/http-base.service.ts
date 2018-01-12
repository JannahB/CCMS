import { Inject, Injectable, forwardRef} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import  { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../../../environments/environment';
import { AuditEntity } from '../../entities/base/audit-entity';
import { DateConverter } from '../../utils/date-converter';

export abstract class HttpBaseService<T extends AuditEntity>{

    public static authenticationToken:string = null;

    protected getBaseUrl():string{
        return `${environment.apiUrl}/api`;
    }

    protected getBaseMockUrl():string{
      return `${environment.mockUrl}`;
    }

    constructor(@Inject(forwardRef(() => HttpClient)) protected http:HttpClient){}

    // public get():Observable<T[]>{
    //     let url:string = this.getBaseUrl();
    //     return this.http.get<T[]>(url);
    // }

    public get():Observable<T[]>{
      let url:string = this.getBaseUrl();

      return this.http.get<T[]>(url)
        .map(res => {
          let items:T[] = res;
          items.forEach( item => {
            if(item.startDate)
              item.startDate = DateConverter.convertDate(item.startDate);
            
            if(item.endDate)
              item.endDate = DateConverter.convertDate(item.endDate);
          })
          return items;
        });
    }

    public getById(id:string | number):Observable<T>{
        let url:string = `${this.getBaseUrl()}/${id}`;
        return this.http.get<T>(url);
    }

    public put(id:string | number, data:T): Observable<T>{
      let url:string = `${this.getBaseUrl()}/${id}`;
      return this.http.put<T>(url, data);
    }

    public patch(id:string | number, data:T): Observable<T>{
      let url:string = `${this.getBaseUrl()}/${id}`;
      return this.http.patch<T>(url, data);
    }

    public post(data:T): Observable<T>{
      let url:string = `${this.getBaseUrl()}`;
      return this.http.post<T>(url, data);
    }

    public delete(id:string | number){
        let url:string = `${this.getBaseUrl()}/${id}`;
        return this.http.delete(url);
    }

    public getMock():Observable<T[]>{
      let url:string = this.getBaseMockUrl();
      return this.http.get<T[]>(url);
    }

}
