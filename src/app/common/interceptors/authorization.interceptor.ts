import { Injectable } from '@angular/core';
import { RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

    public static authToken:string = null;

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        if(!AuthorizationInterceptor.authToken){
            return next.handle(req);
        }

        let request = req.clone({
            setHeaders: {
                token: AuthorizationInterceptor.authToken,
                Authorization: `Bearer ${AuthorizationInterceptor.authToken}`
            } 
        });

        return next.handle(request);
    }
}