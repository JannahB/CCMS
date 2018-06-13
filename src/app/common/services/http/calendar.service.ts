import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { HttpBaseService } from '../http/http-base.service';
import { DayPilot } from 'daypilot-pro-angular';


@Injectable()
export class CalendarService extends HttpBaseService<any> {

  private mockFile: string = 'countries.json';

  events: any[] = [
    {
      id: "1",
      start: "2018-01-01T09:00:00",
      end: "2018-01-01T12:00:00",
      text: "Available"
    },
    {
      id: "2",
      start: "2018-01-01T13:00:00",
      end: "2018-01-01T17:00:00",
      text: "Available"
    },
    {
      id: "3",
      start: "2018-01-02T09:00:00",
      end: "2018-01-02T12:00:00",
      text: "Available"
    },
    {
      id: "4",
      start: "2018-01-02T13:00:00",
      end: "2018-01-02T17:00:00",
      text: "Available"
    },
    {
      id: "5",
      start: "2018-01-03T09:00:00",
      end: "2018-01-03T12:00:00",
      text: "Available"
    },
    {
      id: "6",
      start: "2018-01-03T13:00:00",
      end: "2018-01-03T17:00:00",
      text: "Available"
    },
    {
      id: "7",
      start: "2018-01-04T09:00:00",
      end: "2018-01-04T12:00:00",
      text: "Available"
    },
    {
      id: "8",
      start: "2018-01-04T13:00:00",
      end: "2018-01-04T17:00:00",
      text: "Available"
    },


  ];

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/api/templates`;
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString()).map((response:Response) => response.json());
  }



}
