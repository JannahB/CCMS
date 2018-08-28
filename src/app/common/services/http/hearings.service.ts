import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HttpBaseService } from './http-base.service';
import { CaseHearing } from '../../entities/CaseHearing';


@Injectable()
export class HearingsService extends HttpBaseService<any> {

  private mockFile: string = 'none.json';

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/case-hearings`;
  }

  public getByCaseId(caseId: string | number): Observable<CaseHearing> {
    let url: string = `${super.getBaseUrl()}/case/${caseId}/case-hearings`;
    return this.http.get<CaseHearing>(url);
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }



}
