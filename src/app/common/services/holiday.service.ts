import { HttpClient } from "@angular/common/http";
import { forwardRef, Inject, Injectable } from "@angular/core";
import { Observable } from "../../../../node_modules/rxjs";
import { environment } from "../../../environments/environment";
import { Holiday } from "../entities/Holiday";

@Injectable()
export class HolidayService {
  private readonly baseUrl: string = `${environment.apiUrl}/api/holidays`;

  constructor(
    @Inject(forwardRef(() => HttpClient))
    protected http: HttpClient
  ) {}

  getAll(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(this.baseUrl);
  }

  get(id: number): Observable<Holiday> {
    let url: string = `${this.baseUrl}/${id}`;

    return this.http.get<Holiday>(url);
  }

  post(holiday: Holiday): Observable<Holiday> {
    return this.http.post<Holiday>(this.baseUrl, holiday);
  }

  put(holiday: Holiday): Observable<Holiday> {
    return this.http.put<Holiday>(this.baseUrl, holiday);
  }

  delete(id: number): Observable<void> {
    let url: string = `${this.baseUrl}/${id}`;

    return this.http.delete<void>(url);
  }
}
