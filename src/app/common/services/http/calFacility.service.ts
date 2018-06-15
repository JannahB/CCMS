import { CalFacilityTime } from './../../entities/CalFacilityTime';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { HttpBaseService } from '../http/http-base.service';
import { DayPilot } from 'daypilot-pro-angular';


@Injectable()
export class CalFacilityService extends HttpBaseService<any> {

  private mockFile: string = '';

  events: any[] = [
    {
      id: "1",
      start: "2018-01-01T09:00:00",
      end: "2018-01-01T12:00:00",
      text: "Available"
    }
  ];

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/api/facilities`;
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

  deleteFacilityTimeBlock(id) {
    let url: string = `${super.getBaseUrl()}/api/facility-times/${id}`;
    return this.http
      .delete<CalFacilityTime>(url)
  }


  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {
    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString())
    //  .map((response:Response) => response.json());
  }



}
