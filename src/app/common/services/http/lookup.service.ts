import { Inject, Injectable, forwardRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../../environments/environment';



@Injectable()
export class LookupService {

  public static authenticationToken:string = null;

  protected getBaseUrl():string{
    return `${environment.apiUrl}/api`;
  }

  protected getBaseMockUrl():string{
    return `${environment.mockUrl}`;
  }

  constructor(@Inject(forwardRef(() => HttpClient)) protected http:HttpClient){}


  
  public fetchLookup(endpoint: string) {
    let url: string = this.getBaseUrl() + endpoint;

    return this.http.get(url);
  }
  
  
  public getMock(fileName) {
    let url: string = this.getBaseMockUrl() + fileName;
    
    return this.http.get(url)
  }


  

}
