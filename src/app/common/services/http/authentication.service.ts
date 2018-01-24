import { Inject, Injectable, forwardRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { AuthorizationInterceptor } from '../../interceptors/authorization.interceptor';
import { FetchLoginCredentialsResponse } from '../../entities/fetch-login-credentials-response';
import { FetchTokenResponse } from '../../entities/fetch-token-response';

@Injectable()
export class AuthenticationService{

    public get isLoggedIn():boolean{
        return !!AuthorizationInterceptor.authToken;
    }

    public returnUrl:string = null;

    constructor(@Inject(forwardRef(() => HttpClient)) protected http:HttpClient){}

    public FetchLoginCredentials(userName:string, password:string):Observable<FetchLoginCredentialsResponse>{
        let url:string = `${environment.apiUrl}/FetchLoginCredentials`;

        return this.http
            .post<FetchLoginCredentialsResponse>(url,
            {
                userName: userName,
                password: password
            })
            .map(response => {
              AuthorizationInterceptor.authToken = response.token;

              return response;
            });
    }

    public FetchToken(userName:string, courtOID:number):Observable<FetchTokenResponse>{
        let url:string = `${environment.apiUrl}/FetchToken`;

            return this.http
                .post<FetchTokenResponse>(url,
                {
                    userName: userName,
                    courtOID: courtOID.toString()
                })
                .map(response => {
                    AuthorizationInterceptor.authToken = response.token;

                    return response;
                });
    }
}
