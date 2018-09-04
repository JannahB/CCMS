import { CaseHearingUnavailableBlock } from './../../entities/CaseHearingUnavailableBlock';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HttpBaseService } from './http-base.service';
import { CaseHearing } from '../../entities/CaseHearing';
import { CourtLocation } from '../../entities/CourtLocation';
import { JudicialOfficer } from './../../entities/JudicialOfficer';


@Injectable()
export class HearingsService extends HttpBaseService<any> {

  private mockFile: string = 'none.json';

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/api/case-hearings`;
  }

  public getByCaseId(caseId: string | number): Observable<CaseHearing[]> {
    let url: string = `${super.getBaseUrl()}/api/case/${caseId}/case-hearings`;
    return this.http.get<CaseHearing[]>(url);
  }

  public getHearingTypes(): Observable<CaseHearing[]> {
    let url: string = `${super.getBaseUrl()}/api/hearing-types`;
    return this.http.get<CaseHearing[]>(url)
  }

  public getCourtLocations(): Observable<CourtLocation[]> {
    let url: string = `${super.getBaseUrl()}/api/court-locations`;
    return this.http.get<CourtLocation[]>(url)
  }

  public getJudicialOfficer(): Observable<JudicialOfficer[]> {
    let url: string = `${super.getBaseUrl()}/api/judicial-officers`;
    return this.http.get<JudicialOfficer[]>(url)
  }

  // Ex url:
  // http://localhost:8080/api/unavailableFacilityAndResourceBlocks?week=2018-08-30T15%3A34%3A38.051Z&partyId=2553128234054282&facilityId=1
  public unavailableFacilityAndResourceBlocks(week: Date, partyId: number, facilityId: number): Observable<CaseHearingUnavailableBlock[]> {
    let url: string = `${super.getBaseUrl()}/api/unavailableFacilityAndResourceBlocks`;
    // Note: url params must be strings
    let params = { 'week': week.toString(), 'partyId': partyId.toString(), 'facilityId': facilityId.toString() }
    return this.http.get<CaseHearingUnavailableBlock[]>(url, { params: params });
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }


}
