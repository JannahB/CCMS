import { Injectable } from '@angular/core';

import { LocalStorageService } from './../utility/local-storage.service';
import { AuthorizedCourt } from './../../entities/AuthorizedCourt';
import { GlobalState } from './global.state';

@Injectable()
export class AppStateService {

  private _selectedCourt: AuthorizedCourt

  constructor(
    private localStorageSvc: LocalStorageService,
    private _state: GlobalState
  ) {
    this._state.subscribe('app.loggedOut', (user) => {
      this._selectedCourt = null;
    });
  }

  public get selectedCourt() {
    if (!this._selectedCourt) {
      this._selectedCourt = this.localStorageSvc.getValue('SELECTED_COURT');
    }
    return this._selectedCourt;
  }

  public set selectedCourt(court: AuthorizedCourt) {
    this.localStorageSvc.setValue('SELECTED_COURT', court);
    this._selectedCourt = court;
  }

}
