import { CaseHearingTimesDTO } from './../../entities/CaseHearingTimesDTO';
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
  public unavailableFacilityAndResourceBlocks(week: Date, facilityId: number, partyId: number): Observable<CaseHearingUnavailableBlock[]> {
    let url: string = `${super.getBaseUrl()}/api/case-hearings/unavailableBlocks`;
    // Note: url params must be strings
    let params = { 'week': week.toISOString(), 'partyId': partyId.toString(), 'facilityId': facilityId.toString() }
    return this.http.get<CaseHearingUnavailableBlock[]>(url, { params: params });
  }

  public save(hearing: CaseHearing): Observable<CaseHearing> {
    hearing.days = this.serializeDPDateWithZone(hearing.days);
    if (hearing.id) {
      return this.put<CaseHearing>(hearing.id, hearing);
    } else {
      return this.post<CaseHearing>(hearing);
    }
  }


  private serializeDPDateWithZone(days: any[]): any[] {
    // Serialize the Time Blocks before saving
    days.forEach(block => {
      // if a block is new, stretched or moved, the start and/or end date will be
      // converted to a DayPilot.Date which uses '.value' to hold the string date
      if (block.start.value) {
        block.start = block.start.value + "Z";
      }
      if (block.end.value) {
        block.end = block.end.value + "Z";
      }
    });
    return days;
  }

  deleteCaseHearingTimeBlock(id) {
    let url: string = `${super.getBaseUrl()}/api/case-hearing-times/${id}`;
    return this.http
      .delete<CaseHearingTimesDTO>(url)
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }


}
