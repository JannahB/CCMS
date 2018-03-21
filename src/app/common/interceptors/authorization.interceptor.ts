import { ToastService } from './../services/utility/toast.service';
import { Injectable } from '@angular/core';
import { RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { LocalStorageService } from '../services/utility/local-storage.service';
import { Router } from '@angular/router';
import { AuthenticationModel } from '../model/authentication-model';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  private static readonly AUTH_TOKEN: string = "AUTH_TOKEN";
  private static staticLocalStorageService: LocalStorageService = null;

  private static _authToken: string = null;
  public static get authToken(): string { return AuthorizationInterceptor._authToken; }
  public static set authToken(value: string) {
    AuthorizationInterceptor._authToken = value;

    AuthorizationInterceptor.staticLocalStorageService
      .setValue(AuthorizationInterceptor.AUTH_TOKEN, value);
  }

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private authenticationModel: AuthenticationModel,
    private toastSvc: ToastService
  ) {

    AuthorizationInterceptor.staticLocalStorageService = localStorageService;

    if (localStorageService.hasValue(AuthorizationInterceptor.AUTH_TOKEN)) {
      AuthorizationInterceptor.authToken = localStorageService.getValue(AuthorizationInterceptor.AUTH_TOKEN);
    }
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (!AuthorizationInterceptor.authToken) {
      return next.handle(req);
    }

    let request = req.clone({
      setHeaders: {
        token: AuthorizationInterceptor.authToken,
        Authorization: `Bearer ${AuthorizationInterceptor.authToken}`
      }
    });

    return next.handle(request)
      .do(
        event => event,
        error => {

          // This is difficult to test.  Just navigate to login on all errors for now
          // Until the server sends a 401 status code, leave this commented
          // Otherwise it hangs when refreshing a page when token is expired
          if (error instanceof HttpErrorResponse) {

            if (error.status == 401) {
              this.authenticationModel.returnUrl = this.router.url;
              AuthorizationInterceptor.authToken = null;
              this.router.navigate(["login"]);

            } else if (error.status == 403) {
              this.toastSvc.showWarnMessage(
                'Your role does not allow access to the requested feature.',
                'Forbidden'
              );

            } else if (error.status == 500) {
              this.toastSvc.showErrorMessage(
                'Please accept our apologies! An error occurred. Please report the steps that can be taken to reproduce this to your system administrator.',
                'Server Error 500'
              );
            }

            else {
              // anything else here
              this.toastSvc.showWarnMessage(
                'An error occurred.',
                error.status + ' Error'
              );
            }
          }
        }
      );
  }
}
