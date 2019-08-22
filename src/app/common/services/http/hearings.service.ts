import { CaseHearingTimesDTO } from './../../entities/CaseHearingTimesDTO';
import { CaseHearingUnavailableBlock } from './../../entities/CaseHearingUnavailableBlock';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HttpBaseService } from './http-base.service';
import { CaseHearing } from '../../entities/CaseHearing';
import { CourtLocation } from '../../entities/CourtLocation';
import { JudicialOfficer } from './../../entities/JudicialOfficer';
import { TempHearing } from '../../entities/TempHearing';
import { DateConverter } from '../../utils/date-converter';
import { Court } from '../../entities/Court';
import { ConflictedHearing } from '../../entities/ConflictedHearing';


@Injectable()
export class HearingsService extends HttpBaseService<any> {

  private mockFile = 'none.json';
  private isTempHearing = false;

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return this.isTempHearing ? `${super.getBaseUrl()}/api/temp-hearings` : `${super.getBaseUrl()}/api/case-hearings`;
  }

  public getByCaseId(caseId: string | number): Observable<CaseHearing[]> {
    const url = `${super.getBaseUrl()}/api/case/${caseId}/case-hearings`;
    return this.http.get<CaseHearing[]>(url);
  }

  public getTempByCaseId(caseId: string | number): Observable<TempHearing[]> {
    const url = `${super.getBaseUrl()}/api/case/${caseId}/temp-hearings`;
    return this.http.get<TempHearing[]>(url)
      .map(result => {
        const hearings: TempHearing[] = result;
        return this.convertHearingDates(hearings);
      });
  }

  public getHearingTypes(): Observable<CaseHearing[]> {
    const url = `${super.getBaseUrl()}/api/hearing-types`;
    return this.http.get<CaseHearing[]>(url);
  }

  public getCourtLocations(): Observable<CourtLocation[]> {
    const url = `${super.getBaseUrl()}/api/court-locations`;
    return this.http.get<CourtLocation[]>(url);
  }

  public getCourts(): Observable<Court[]> {
    const url = `${super.getBaseUrl()}/api/courts`;
    return this.http.get<Court[]>(url);
  }

  public getJudicialOfficer(): Observable<JudicialOfficer[]> {
    const url = `${super.getBaseUrl()}/api/judicial-officers`;
    return this.http.get<JudicialOfficer[]>(url);
  }

  public getConflicts(JOId: number, date: string): Observable<TempHearing[]> {
    const url = `${super.getBaseUrl()}/api/case/temp-hearings/${JOId}/${date}`;
    console.log(url);
    return this.http.get<TempHearing[]>(url);
  }

  // Ex url:
  // http://localhost:8080/api/unavailableFacilityAndResourceBlocks?week=2018-08-30T15%3A34%3A38.051Z&partyId=2553128234054282&facilityId=1
  public unavailableFacilityAndResourceBlocks(week: Date, facilityId: number, partyId: number): Observable<CaseHearingUnavailableBlock[]> {
    const url = `${super.getBaseUrl()}/api/case-hearings/unavailableBlocks`;
    // Note: url params must be strings
    const params = { 'week': week.toISOString(), 'partyId': partyId.toString(), 'facilityId': facilityId.toString() };
    return this.http.get<CaseHearingUnavailableBlock[]>(url, { params: params });
  }

  public save(hearing: CaseHearing): Observable<CaseHearing> {
    hearing.days = this.serializeDPDateWithZone(hearing.days);
    if (hearing.id > 0) {
      return this.put<CaseHearing>(hearing.id, hearing);
    } else {
      hearing.id = null;
      return this.post<CaseHearing>(hearing);
    }
  }

  public tempSave(hearing: TempHearing): Observable<TempHearing> {
    this.isTempHearing = true;
    if (hearing.id > 0) {
      return this.put<TempHearing>(hearing.id, hearing);
    } else {
      hearing.id = null;
      return this.post<TempHearing>(hearing);
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
    const url = `${super.getBaseUrl()}/api/case-hearing-times/${id}`;
    return this.http
      .delete<CaseHearingTimesDTO>(url);
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

  private convertHearingDates(hearings: TempHearing[]) {
    if (!hearings || !hearings.length || Object.keys(hearings).length === 0 || hearings[0] === undefined) {
      return [];
    }
    hearings.forEach(hearing => {
      if (hearing) {
        hearing.hearingDate = DateConverter.convertDate(hearing.hearingDate);
        hearing.startDateTime = DateConverter.convertDate(hearing.startDateTime);
        hearing.endDateTime = DateConverter.convertDate(hearing.endDateTime);
      }
    });
    return hearings;
  }


}
