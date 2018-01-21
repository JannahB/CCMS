import { Injectable, forwardRef, Inject } from '@angular/core';
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
import { IccsCode } from '../../entities/IccsCode';
import { DatePipe } from '@angular/common';
import { CaseParty } from '../../entities/CaseParty';
import { ChargeFactor } from '../../entities/ChargeFactor';
import { CasePartyRole } from '../../entities/CasePartyRole';
import { DocTemplate } from '../../entities/DocTemplate';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { AuthorizationInterceptor } from '../../interceptors/authorization.interceptor';


@Injectable()
export class CaseService extends HttpBaseService<Case> {

  private mockFile: string = 'cases-b.json';
  private datePipe:DatePipe = new DatePipe("en");

  // Override Base URL's set in Super
  // protected getBaseUrl():string{
  //   return `${super.getBaseUrl()}/FetchCase`;
  // }

  protected getBaseMockUrl():string{
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

  constructor(
    @Inject(forwardRef(() => HttpClient)) protected http:HttpClient,
    @Inject(forwardRef(() => Http)) protected classicHttp:Http
  ){
    super(http);
  }


  public fetchAny(obj:any):Observable<Case[]>{
    let url: string = `${super.getBaseUrl()}/FetchCase`;
    
    return this.http.post<Case[]>(url, obj)
      .map(res => {
        let cases:Case[] = res;
        return this.convertDates(cases);
      })
  }

  public fetchOne(id:string):Observable<Case>{
    let url: string = `${super.getBaseUrl()}/FetchCase`;
    
    return this.http.post<Case>(url,
      { caseOID : id })
      .map(res => {
        let kase:Case = res[0];
        kase = this.convertDates([kase])[0];
        return kase;
      })
  }


  public fetch(body:any):Observable<Case[]>{
    let url: string = `${super.getBaseUrl()}/FetchCase`;
    
    return this.http.post<Case[]>(url, body,
    )
      .map(res => {
        let cases:Case[] = res;
        return this.convertDates(cases);
      })
  }

  public get():Observable<Case[]>{
    let url:string = `${super.getBaseUrl()}/FetchCase`;

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


      let caseParties: CaseParty[] = kase.caseParties;
      if(caseParties) {
        caseParties.forEach( cp => {
          let caseParty = cp.caseParty;

          caseParty.dob = DateConverter.convertDate(caseParty.dob);

          let idents:Identifier[] = caseParty.identifiers;
          if(idents) {
            idents.forEach( idf => {
              idf.startDate = DateConverter.convertDate(idf.startDate);
              idf.endDate = DateConverter.convertDate(idf.endDate);
            })
          }
          let addresses:Address[] = caseParty.addresses;
          if(addresses) {
            addresses.forEach( addr => {
              addr.startDate = DateConverter.convertDate(addr.startDate);
              addr.endDate = DateConverter.convertDate(addr.endDate);
            })
          }
          let emails:Email[] = caseParty.emails;
          if(emails) {
            emails.forEach( em => {
              em.startDate = DateConverter.convertDate(em.startDate);
              em.endDate = DateConverter.convertDate(em.endDate);
            })
          }
          let phones:PhoneNumber[] = caseParty.phoneNumbers;
          if(phones) {
            phones.forEach(ph => {
              ph.startDate = DateConverter.convertDate(ph.startDate);
              ph.endDate = DateConverter.convertDate(ph.endDate);
            })
          }

          let now:Date = new Date();
          let age:number = 0;

          if(caseParty.dob.getMonth() == now.getMonth()){
            if(caseParty.dob.getDate() > now.getDate()){
                age = now.getFullYear() - caseParty.dob.getFullYear() - 1;
            }else{
                age = now.getFullYear() - caseParty.dob.getFullYear();
            }
          }else if(caseParty.dob.getMonth() > now.getMonth()){
            age =  now.getFullYear() - caseParty.dob.getFullYear() - 1;
          }else{
            age =  now.getFullYear() - caseParty.dob.getFullYear();
          }

          caseParty.age = age;

        });
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

  public fetchICCSCategory(iccsCodeOID:number = null):Observable<IccsCode[]>{
    let url:string = `${super.getBaseUrl()}/FetchICCSCategory`;
    
    let params:Object = "";
    
    if(iccsCodeOID){
      params = { iccsCodeOID: iccsCodeOID.toString() };
    }

    return this.http.post<IccsCode[]>(url, params);
  }

  public fetchChargeFactor():Observable<ChargeFactor[]>{
    let url:string = `${super.getBaseUrl()}/FetchChargeFactor`;

    return this.http.post<ChargeFactor[]>(url, "");
  }

  public saveCourtCase(data:Case):Observable<Case>{
    var caseData:any = {
      caseFilingDate: null,
      caseType: null,
      caseStatus: null,
      casePhase: null,
      caseWeight: "0",
      caseParties: [],
      caseCharges: []
    };
    if (data.caseOID)
        caseData.caseOID = data.caseOID.toString();

    if (data.caseFilingDate)
        caseData.caseFilingDate = this.datePipe.transform(data.caseFilingDate, "yyyy-MM-dd");
    if (data.caseType)
        caseData.caseType = data.caseType.caseTypeOID.toString();
    if (data.caseStatus)
        caseData.caseStatus = data.caseStatus.statusOID.toString();
    if (data.casePhase)
        caseData.casePhase = data.casePhase.casePhaseOID.toString();
    if (data.caseWeight)
        caseData.caseWeight = data.caseWeight.toString();
    if (data.caseParties.length > 0) {
        data.caseParties.forEach(value => {
            var party = {
                partyRoleOID: value.role ? value.role.casePartyRoleOID.toString() : null,
                partyOID: value.caseParty.partyOID.toString(),
                startDate: this.datePipe.transform(value.startDate, "yyyy-MM-dd"),
                endDate: null
            };

            if (value.endDate)
                party.endDate = this.datePipe.transform(value.endDate, "yyyy-MM-dd");

            caseData.caseParties.push(party);
        });
    }
    if (data.caseCharges.length > 0) {
        data.caseCharges.forEach(value => {
            var charge:any = {
                iccsCodeOID: value.iccsCode.iccsCodeOID.toString(),
                lea: value.leaChargingDetails,
                factors: []
            };
            if (value.localCharge)
                charge.localChargeOID = value.localCharge.localChargeOID.toString();
            value.chargeFactors.forEach(factor => {
                charge.factors.push(factor.chargeFactorOID.toString());
            });
            caseData.caseCharges.push(charge);
        });
    }

    let url:string = `${super.getBaseUrl()}/SaveCourtCase`;

    return this.http
      .post<Case[]>(url, caseData)
      .map(c => this.convertDates(c)[0]);
  }

  public fetchCasePartyRole():Observable<CasePartyRole[]>{
    let url:string = `${super.getBaseUrl()}/FetchCasePartyRole`;

    return this.http
      .get<CasePartyRole[]>(url);
  }

  public fetchDocumentTemplate():Observable<DocTemplate[]>{
    let url:string = `${super.getBaseUrl()}/FetchDocumentTemplate`;
    
    return this.http
      .get<DocTemplate[]>(url);
  }

  public downloadCourtDocument(caseOID:number, documentTemplateOID:number):Observable<ArrayBuffer>{
    let url:string = `${super.getBaseUrl()}/GenerateCourtDocument`;
    let params:object = {
      caseOID: caseOID.toString(),
      documentTemplateOID: documentTemplateOID.toString()
    };
    
    let options:RequestOptionsArgs = {}
    let headers:Headers = new Headers();
    
    headers.append("token", AuthorizationInterceptor.authToken);
    headers.append("Authorization", `Bearer ${AuthorizationInterceptor.authToken}`);

    options.headers = headers;

    return this.classicHttp
      .post(url, params, options)
      .map(response => {
        let headers = response.headers;
        let contentType = headers.get('content-type');
        let fileName = headers.get('content-disposition').split('; ')[1].split('=')[1].replace(/"/g,'');
        let result = response.arrayBuffer();
        let data = new Blob([result], { type: contentType });
        return result;
      });

  }
}
