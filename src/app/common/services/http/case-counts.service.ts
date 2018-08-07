import { CourtCount } from './../../entities/CourtCount';
import { CaseCount } from './../../entities/CaseCount';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { HttpBaseService } from '../http/http-base.service';

@Injectable()
export class CaseCountsService extends HttpBaseService<any> {

  private mockFile: string = '';

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/api/case-counts`;
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

  getCaseCountsByYear(year: number = new Date().getFullYear()): Observable<CourtCount[]> {

    let params = new HttpParams();
    params = params.append('year', year.toString());
    return this.http.get<CourtCount[]>(this.getBaseUrl(), { params: params });
  }

}
