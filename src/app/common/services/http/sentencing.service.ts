import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpBaseService } from './http-base.service';
import { CriminalCharge } from '../../entities/CriminalCharge';


@Injectable()
export class SentencingService extends HttpBaseService<any> {

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/api/sentencing`;
  }

  public getAllByCaseId(caseId: number): Observable<CriminalCharge[]> {
    let url: string = `${super.getBaseUrl()}/api/sentencing/`+caseId;

    return this.http.get<CriminalCharge[]>(url)
      .map(res => {
        let sentencing: CriminalCharge[] = res;
        return sentencing;
      });
  }

  public postByType(data: any): Observable<any[]> {
    let url: string = `${super.getBaseUrl()}/api/`+data.type+`/`;

    return this.http.post<any[]>(url, data)
      .map(res => {
        let sentencing: any[] = res;
        return sentencing;
      });
  }
}
