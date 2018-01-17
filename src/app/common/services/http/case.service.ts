import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { CaseTask } from './../../entities/CaseTask';
import { Address } from './../../entities/Address';
import { Identifier } from './../../entities/Identifier';
import { Party } from './../../entities/Party';
import { CaseHearing } from './../../entities/CaseHearing';
import { CaseEvent } from './../../entities/CaseEvent';
import { CaseDocument } from './../../entities/CaseDocument';
import { PhoneNumber } from './../../entities/PhoneNumber';
import { DateConverter } from './../../utils/date-converter';
import { HttpBaseService } from '../http/http-base.service';
import { Case } from './../../entities/Case';
import { CaseHearings } from '../../entities/CaseHearings';
import { Email } from '../../entities/Email';


@Injectable()
export class CaseService extends HttpBaseService<Case> {

  private mockFile: string = 'cases-b.json';

  // Override Base URL's set in Super
  protected getBaseUrl():string{
    return `${super.getBaseUrl()}/FetchCase`;
  }

  protected getBaseMockUrl():string{
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }


  public fetchAny(obj:any):Observable<Case[]>{
    let url: string = this.getBaseUrl();

    return this.http.post<Case[]>(url, obj,
      {
        headers: { uiVersion: "2" }
      })
      .map(res => {
        let cases:Case[] = res;
        return this.convertDates(cases);
      })
  }

  public fetchOne(id:string):Observable<Case>{
    let url: string = this.getBaseUrl();

    return this.http.post<Case>(url,
      { caseOID : id },
      {
        headers: { uiVersion: "2" }
      })
      .map(res => {
        let kase:Case = res[0];
        kase = this.convertDates([kase])[0];
        return kase;
      })
  }


  public fetch(body:any):Observable<Case[]>{
    let url: string = this.getBaseUrl();

    return this.http.post<Case[]>(url, body)
      .map(res => {
        let cases:Case[] = res;
        return this.convertDates(cases);
      })
  }

  public get():Observable<Case[]>{
    let url:string = this.getBaseUrl();

    return this.http.get<Case[]>(url)
      .map(res => {
        let cases:Case[] = res;

        return this.convertDates(cases);
      });
  }

  public getMock():Observable<Case[]>{
    let url:string = this.getBaseMockUrl();
    return this.http.get<Case[]>(url)
      .map(res => {
        let cases:Case[] = res;
        return this.convertDates(cases);
      });
  }

  public getOneMock(caseId:string):Observable<Case>{
    let url:string = this.getBaseMockUrl();
    return this.http.get<Case[]>(url)
      .map(res => {
        let cases:Case[] = res;
        cases = this.convertDates(cases);
        let kase:Case = cases[0];
        return kase;
      });
  }

  private convertDates(cases:Case[]){
    if(!cases || Object.keys(cases).length === 0) return;
    cases.forEach( kase => {
      kase.caseFilingDate = DateConverter.convertDate(kase.caseFilingDate);

      let caseDocs:CaseDocument[] = kase.caseDocs;
      if(caseDocs) {
        caseDocs.forEach( cd => {
          cd.docReceived = DateConverter.convertDate(cd.docReceived);
          cd.docSent = DateConverter.convertDate(cd.docSent);
          cd.lastUpdateDate = DateConverter.convertDate(cd.lastUpdateDate);
        })
      }

      let caseEvents: CaseEvent[] = kase.caseEvents;
      if(caseEvents) {
        caseEvents.forEach( ce => {
          ce.eventDate = DateConverter.convertDate(ce.eventDate);
        })
      }

      // TODO: This needs work after CaseHearings entity changes are made
      // let caseHearings: CaseHearing[] = kase.caseHearings.hearing;


      let caseParties: Party[] = kase.caseParties;
      if(caseParties) {
        caseParties.forEach( cp => {
          cp.dob = DateConverter.convertDate(cp.dob);

          let idents:Identifier[] = cp.identifiers;
          if(idents) {
            idents.forEach( idf => {
              idf.startDate = DateConverter.convertDate(idf.startDate);
              idf.endDate = DateConverter.convertDate(idf.endDate);
            })
          }
          let addresses:Address[] = cp.addresses;
          if(addresses) {
            addresses.forEach( addr => {
              addr.startDate = DateConverter.convertDate(addr.startDate);
              addr.endDate = DateConverter.convertDate(addr.endDate);
            })
          }
          let emails:Email[] = cp.emails;
          if(emails) {
            emails.forEach( em => {
              em.startDate = DateConverter.convertDate(em.startDate);
              em.endDate = DateConverter.convertDate(em.endDate);
            })
          }
          let phones:PhoneNumber[] = cp.phoneNumbers;
          if(phones) {
            phones.forEach(ph => {
              ph.startDate = DateConverter.convertDate(ph.startDate);
              ph.endDate = DateConverter.convertDate(ph.endDate);
            })
          }
        })
      }

      let caseTasks: CaseTask[] = kase.caseTasks;
      if(caseTasks) {
        caseTasks.forEach( ct => {
          ct.assignedDate = DateConverter.convertDate(ct.assignedDate);
          ct.dueDate = DateConverter.convertDate(ct.dueDate);
        })
      }


    })
    return cases;
  }

}
