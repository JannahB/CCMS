import { Injectable, forwardRef, Inject } from "@angular/core";
import {
  Http,
  RequestOptionsArgs,
  Headers,
  ResponseContentType
} from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { HttpBaseService } from "./http-base.service";
import { Observable } from "rxjs/Observable";
import { DateConverter } from "../../utils/date-converter";
import { DatePipe } from "@angular/common";
import { CaseEventDTO } from "../../entities/CaseEventDTO";

@Injectable()
export class EventService extends HttpBaseService<CaseEventDTO> {
  private datePipe: DatePipe = new DatePipe("en");

  constructor(
    @Inject(forwardRef(() => HttpClient)) protected http: HttpClient,
    @Inject(forwardRef(() => Http)) protected classicHttp: Http
  ) {
    super(http);
  }

  public getEvents(): Observable<CaseEventDTO[]> {
    const url = `${super.getBaseUrl()}/api/events`;
    console.log(url);
    return this.http.get<CaseEventDTO[]>(url).map(res => {
      const events: CaseEventDTO[] = res;
      return this.convertDates(events);
    });
  }

  private convertDates(events: CaseEventDTO[]) {
    if (
      !events ||
      !events.length ||
      Object.keys(events).length === 0 ||
      events[0] === undefined
    ) {
      return [];
    }
    events.forEach(event => {
      if (event.eventDate) {
        event.eventDate = DateConverter.convertDate(event.eventDate);
      }
    });
    return events;
  }

  public save(event: CaseEventDTO): Observable<CaseEventDTO> {
    const url = `${super.getBaseUrl()}/api/events/`;
    if (event.ID > 0) {
      return this.http.put<CaseEventDTO>(url, event);
    } else {
      event.ID = null;
      return this.http.post<CaseEventDTO>(url, event);
    }
  }
}
