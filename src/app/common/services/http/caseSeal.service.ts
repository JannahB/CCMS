import { Inject, Injectable, forwardRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CaseSealService{

    constructor(@Inject(forwardRef(() => HttpClient)) protected http:HttpClient){}

    public validateCaseSealCredentials(userName:string, password:string, caseId:string):Observable<boolean>{
        let url:string = `${environment.apiUrl}/CaseSealCredentials`;

        return this.http
            .post<boolean>(url,
            {
                userName: userName,
                password: password,
                caseID: caseId
            })
            .map(response => {
              return response;
            });
    }


}
