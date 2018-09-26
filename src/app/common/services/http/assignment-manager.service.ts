import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpBaseService } from './http-base.service';


@Injectable()
export class AssignmentManagerService extends HttpBaseService<any> {

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/api/allocation-periods`;
  }

  public getWeightAllocationByAllocationPeriodId(allocationPeriodId: string | number): Observable<any[]> {
    let url: string = `${super.getBaseUrl()}/api/allocation-periods/${allocationPeriodId}/weight-allocations`;
    return this.http.get<any[]>(url)
  }

}
