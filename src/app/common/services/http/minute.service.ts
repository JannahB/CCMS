import { Injectable, forwardRef, Inject  } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import { Observable } from 'rxjs/Observable';
import { Minute } from '../../entities/Minute';
import { DateConverter } from '../../utils/date-converter';
import { DatePipe } from '@angular/common';


@Injectable()
export class MinuteService extends HttpBaseService<Minute> {

  private datePipe: DatePipe = new DatePipe("en");

  constructor(
    @Inject(forwardRef(() => HttpClient)) protected http: HttpClient,
    @Inject(forwardRef(() => Http)) protected classicHttp: Http
  ) {
    super(http);
  }

  // deprecated
  // public fetch(body: any): Observable<Minute[]> {
  //   const url = `${super.getBaseUrl()}/api/minutes`;

  //   return this.http.post<Minute[]>(url, body,
  //   )
  //     .map(res => {
  //       const minutes: Minute[] = res;
  //       return this.convertDates(minutes);
  //     });
  // }

  public getMinutes(): Observable<Minute[]> {
    const url = `${super.getBaseUrl()}/api/minutes`;
    console.log(url);
    return this.http
      .get<Minute[]>(url)
      .map(res => {
        const minutes: Minute[] = res;
        return this.convertDates(minutes);
      });
  }

  public getMinutesByCaseId(caseId: string | number): Observable<Minute[]> {
    const url = `${super.getBaseUrl()}/api/minutes/${caseId}`;
    return this.http
      .get<Minute[]>(url)
      .map(result => {
        const minutes: Minute[] = result;
        return this.convertDates(minutes);
      });
  }

  public getMinutesByHearingId(caseId: string | number, hearingId: string | number): Observable<Minute[]> {
    const url = `${super.getBaseUrl()}/api/minutes/${caseId}/${hearingId}`;
    return this.http
      .get<Minute[]>(url)
      .map(result => {
        const minutes: Minute[] = result;
        return this.convertDates(minutes);
      });
  }

  private convertDates(minutes: Minute[]) {
    if (!minutes || !minutes.length || Object.keys(minutes).length === 0 || minutes[0] === undefined) {
      return [];
    }
    minutes.forEach(minute => {
      if (minute.minuteDate) {
        minute.minuteDate = DateConverter.convertDate(minute.minuteDate);
      }
    });
    return minutes;
  }

  public save(minute: Minute): Observable<Minute> {
    const url = `${super.getBaseUrl()}/api/minutes/`;
    if (minute.id > 0) {
      return this.http.put<Minute>(url, minute);
    } else {
      minute.id = null;
      return this.http.post<Minute>(url, minute);
    }
  }


}
