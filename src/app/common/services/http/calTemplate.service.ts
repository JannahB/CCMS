import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { DayPilot } from 'daypilot-pro-angular';

import { HttpBaseService } from '../http/http-base.service';
import { CalTemplateTime } from './../../entities/CalTemplateTime';
import { CalTemplate } from './../../entities/CalTemplate';


@Injectable()
export class CalTemplateService extends HttpBaseService<any> {

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
    return `${super.getBaseUrl()}/api/templates`;
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

  saveTemplate(item: CalTemplate): Observable<CalTemplate> {
    item.days = this.serializeDPDateWithZone(item.days);
    if (item.id)
      return super.put(item.id, item);
    else
      return super.post(item);
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
      // if a guid (assigned to new blocks by calendar) then change to a
      // number that will be overwritten by server to a server long type
      if (block.id.length == 36) {
        // delete block.id
        block.id = Math.round((Math.random() * 10000000000000000));
      }
    });
    return days;
  }

  deleteTemplateTimeBlock(id) {
    let url: string = `${super.getBaseUrl()}/api/template-times/${id}`;
    return this.http
      .delete<CalTemplateTime>(url)
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
