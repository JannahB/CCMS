import { Inject, Injectable, forwardRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../../environments/environment';



@Injectable()
export class CourtService {

  protected getBaseUrl():string{
    return `${environment.apiUrl}`;
  }

  protected getBaseMockUrl():string{
    return `${environment.mockUrl}`;
  }

  constructor(@Inject(forwardRef(() => HttpClient)) protected http:HttpClient){}


  public updateSelectedCourt<T>(courtOID):Observable<T> {
    if(!courtOID) return;

    let url: string = this.getBaseUrl() + '/UpdateSelectedCourt';

    return this.http.post<T>(
      url,
      { courtOID: courtOID.toString() },
      { headers:
        { uiVersion: "2" }
      }
    );
  }


  public getMock(fileName) {
    let url: string = this.getBaseMockUrl() + fileName;
    return this.http.get(url)
  }

}
