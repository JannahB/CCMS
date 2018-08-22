import { UserService } from './../services/utility/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationModel } from '../model/authentication-model';

@Injectable()
export class CanActivateIsCourtMgrGuard implements CanActivate {

  constructor(
    private authenticationModel: AuthenticationModel,
    private userSvc: UserService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.userSvc.isCourtManager() || this.userSvc.isAdminUser()) {
      return true;
    }

    this.authenticationModel.returnUrl = state.url;

    this.router.navigate(["/"]);

    return false;
  }
}
