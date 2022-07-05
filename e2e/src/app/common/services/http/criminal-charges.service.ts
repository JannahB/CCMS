import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpBaseService } from './http-base.service';


@Injectable()
export class CriminalChargeService extends HttpBaseService<any> {

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/api/criminal-charges`;
  }
}
