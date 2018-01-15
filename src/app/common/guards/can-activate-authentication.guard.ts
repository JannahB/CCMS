import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../services/http/authentication.service';

@Injectable()
export class CanActivateAuthenticationGuard implements CanActivate {

  constructor(
    private authenticationService:AuthenticationService,
    private router:Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if(this.authenticationService.isLoggedIn){
        return true;
      }

      this.router.navigateByUrl("/login");

      return false;
  }
}
