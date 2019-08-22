import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpBaseService } from './http-base.service';
import { RegisterEntry } from '../../entities/RegisterEntry';
import { Case } from '../../entities/Case';
import { ToastService } from '../utility/toast.service';
import { UserService } from '../utility/user.service';
import { HearingsService } from './hearings.service';
import { AppStateService } from '../state/app.state.sevice';
import { CaseService } from './case.service';

@Injectable()
export class CaseRegisterService extends HttpBaseService<any> {

  private mockFile = 'none.json';

  private caseSvc: CaseService;
  toastSvc: ToastService;

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/SaveToRegister`;
  }

  public save(registerEntry: RegisterEntry): Observable<RegisterEntry> {
    return this.post<RegisterEntry>(registerEntry);
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }


}
