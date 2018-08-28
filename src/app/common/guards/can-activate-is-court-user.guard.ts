import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../services/http/authentication.service';
import { AuthenticationModel } from '../model/authentication-model';
import { UserService } from '../services/utility/user.service';

@Injectable()
export class CanActivateIsCourtUserGuard implements CanActivate {

  constructor(
    private authenticationService:AuthenticationService,
    private authenticationModel:AuthenticationModel,
    private userSvc: UserService,
    private router:Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if( this.userSvc.isAdminUser() ){
        return true;
      }

      this.authenticationModel.returnUrl = state.url;

      this.router.navigate(["/"]);

      return false;
  }
}
