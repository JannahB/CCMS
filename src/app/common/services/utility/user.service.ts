import { Role } from './../../entities/Role';
import { Injectable } from '@angular/core';

import { GlobalState } from './../state/global.state';
import { LocalStorageService } from './local-storage.service';
import { Party } from '../../entities/Party';
import { Permission } from '../../entities/Permission';



@Injectable()
export class UserService {

  private _loggedInUser: any;

  constructor(
    private localStorageSvc: LocalStorageService,
    public _state: GlobalState
  ) {
    this._state.subscribe('app.loggedIn', (user) => {
      this.loggedInUser = user;
    });
  }


  public get loggedInUser() {
    if (!this._loggedInUser) {
      this._loggedInUser = this.localStorageSvc.getValue('LOGGED_IN_USER');
    }
    return this._loggedInUser;
  }

  public set loggedInUser(user: any) {
    this.localStorageSvc.setValue('LOGGED_IN_USER', user);
    this._loggedInUser = user;
  }

  public isAdminUser(): boolean {
    if (!this.loggedInUser || !this.loggedInUser.roles || !this.loggedInUser.roles.length) return false;

    let idx = this.loggedInUser.roles.findIndex(itm => itm.ccmsAdmin == true);
    console.log('Logged in user', this.loggedInUser.userName);
    console.log('  Admin Role', (idx > -1));
    return idx > -1;
  }

  hasPermission(pmId: number, courtOID: number): boolean {
    console.log('pmId', pmId);
    if (!this.loggedInUser || !this.loggedInUser.roles || !this.loggedInUser.roles.length) return false;

    let roles: Role[] = this.loggedInUser.roles;
    let roleByCourtId = roles.find(itm => itm.courtOID == courtOID);
    if (!roleByCourtId) return false;

    // TODO: Handle switching of selectedCourt
    let courtPermissions: Permission[] = roleByCourtId.permissions;
    if (!courtPermissions.length) return false;
    let idx = courtPermissions.findIndex(itm => itm.permissionID == pmId);
    console.log('  idx', idx)
    return idx > -1;
  }



}
