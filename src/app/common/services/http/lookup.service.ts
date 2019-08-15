import { Inject, Injectable, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../../environments/environment';



@Injectable()
export class LookupService {

  public static authenticationToken: string = null;

  protected getBaseUrl(): string {
    return `${environment.apiUrl}`;
  }

  protected getBaseMockUrl(): string {
    return `${environment.mockUrl}`;
  }

  constructor(@Inject(forwardRef(() => HttpClient)) protected http: HttpClient) { }



  public fetchLookup<T>(endpoint: string): Observable<T[]> {
    const url: string = this.getBaseUrl() + '/' + endpoint;
    return this.http.get<T[]>(url);
  }

  public fetchPhaseByTypeLookup<T>(caseTypeOID: string | number): Observable<T[]> {
    const url: string = this.getBaseUrl() + '/FetchPhaseByType';

    return this.http.post<T[]>(
      url,
      { typeOID: caseTypeOID.toString() },
      {
        headers:
          { uiVersion: '2' }
      }
    );
  }

  public fetchSubTypeByTypeLookup<T>(caseTypeOID: string | number): Observable<T[]> {
    const url: string = this.getBaseUrl() + '/FetchCaseSubType';

    return this.http.post<T[]>(
      url,
      { typeOID: caseTypeOID.toString() },
      {
        headers:
          { uiVersion: '2' }
      }
    );
  }

  public getMock(fileName) {
    const url: string = this.getBaseMockUrl() + fileName;

    return this.http.get(url);
  }




}
