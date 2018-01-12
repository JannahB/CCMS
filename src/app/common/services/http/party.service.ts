import { PhoneNumber } from './../../entities/PhoneNumber';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DateConverter } from './../../utils/date-converter';
import { HttpBaseService } from '../http/http-base.service';
import { Party } from './../../entities/Party';
import { Identifier } from '../../entities/Identifier';
import { Address } from './../../entities/Address';
import { Email } from '../../entities/Email';


@Injectable()
export class PartyService extends HttpBaseService<Party> {

  private mockFile: string = 'parties.json';

  // Override Base URL's set in Super
  protected getBaseUrl():string{
    return `${super.getBaseUrl()}/FetchParty`;
  }

  protected getBaseMockUrl():string{
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

  public fetch(body:any):Observable<Party[]>{
    let url: string = this.getBaseUrl();

    return this.http.post<Party[]>(url, body)
      .map(res => {
        let parties:Party[] = res;
        return this.convertDates(parties);
      })
  }

  public get():Observable<Party[]>{
    let url:string = this.getBaseUrl();

    return this.http.get<Party[]>(url)
      .map(res => {
        let parties:Party[] = res;
        
        return this.convertDates(parties);
      });
  }

  public getMock():Observable<Party[]>{
    let url:string = this.getBaseMockUrl();
    return this.http.get<Party[]>(url)
      .map(res => {
        let parties:Party[] = res;
        // parties.forEach( p => {
        //   p.dob = DateConverter.convertDate(p.dob);
        // })
        return this.convertDates(parties);
      });
  }

  public getOneMock(partyId:string):Observable<Party>{
    let url:string = this.getBaseMockUrl();
    return this.http.get<Party[]>(url)
      .map(res => {
        let parties:Party[] = res;
        parties = this.convertDates(parties);
        let party:Party = parties[0];
        return party;
      });
  }

  private convertDates(parties:Party[]){
    if(!parties) return;

    parties.forEach( p => {
      p.dob = DateConverter.convertDate(p.dob);
      
      let idents:Identifier[] = p.identifiers;
      if(idents) {
        idents.forEach( idf => {
          idf.startDate = DateConverter.convertDate(idf.startDate);
          idf.endDate = DateConverter.convertDate(idf.endDate);
        })
      }
      let addresses:Address[] = p.addresses;
      if(addresses) {
        addresses.forEach( addr => {
          addr.startDate = DateConverter.convertDate(addr.startDate);
          addr.endDate = DateConverter.convertDate(addr.endDate);
        })
      }
      let emails:Email[] = p.emails;
      if(emails) {
        emails.forEach( em => {
          em.startDate = DateConverter.convertDate(em.startDate);
          em.endDate = DateConverter.convertDate(em.endDate);
        })
      }
      let phones:PhoneNumber[] = p.phoneNumbers;
      if(phones) {
        phones.forEach(ph => {
          ph.startDate = DateConverter.convertDate(ph.startDate);
          ph.endDate = DateConverter.convertDate(ph.endDate);
        })
      }

    })
    return parties;
  }

}
