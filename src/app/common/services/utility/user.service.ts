import { Injectable } from '@angular/core';

import { GlobalState } from './../state/global.state';
import { LocalStorageService } from './local-storage.service';
import { Party } from '../../entities/Party';



@Injectable()
export class UserService {

  private _loggedInUser: any;

  constructor(
    private localStorageSvc: LocalStorageService,
    public _state:GlobalState
  ) {
    this._state.subscribe('app.loggedIn', (user) => {
      this.loggedInUser = user;
    });
   }


  public get loggedInUser(){
    if(!this._loggedInUser) {
      this._loggedInUser = this.localStorageSvc.getValue('LOGGED_IN_USER');
    }
    return this._loggedInUser;
  }

  public set loggedInUser(user:any){
    this.localStorageSvc.setValue('LOGGED_IN_USER', user);
    this._loggedInUser = user;
  }

  public isAdminUser():boolean {
    if(!this.loggedInUser || !this.loggedInUser.roles || !this.loggedInUser.roles.length ) return false;

    let idx = this.loggedInUser.roles.findIndex( itm => itm.ccmsAdmin == true);
    console.log('Logged in user', this.loggedInUser.userName);
    console.log('  Admin Role', (idx > -1) );
    return idx > -1;
  }



}
