import { CaseTaskDTO } from './../../entities/CaseTaskDTO';
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
import { Http, RequestOptionsArgs, Headers, ResponseContentType } from '@angular/http';
import { AuthorizationInterceptor } from '../../interceptors/authorization.interceptor';
import { JudicialOfficer } from '../../entities/JudicialOfficer';
import { JudicialAssignment } from '../../entities/JudicialAssignment';
import { FileSaver } from '../utility/file-saver.service';
import { EventType } from '../../entities/EventType';


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
        let kases:Case[] = res;
        return this.convertDates(kases);
      })
  }

  public fetchOne(id:string):Observable<Case>{
    let url: string = `${super.getBaseUrl()}/FetchCase`;

    return this.http.post<Case>(url,
      { caseOID : id })
      .map(res => {
        if(res[0] == undefined) {
          // this handles server return of [undefined]
          // an array populated with undefined
          return new Case();
        }else {
          let kase:Case = res[0];
          kase = this.convertDates([kase])[0];
          return kase;
        }
      })
  }


  public fetch(body:any):Observable<Case[]>{
    let url: string = `${super.getBaseUrl()}/FetchCase`;

    return this.http.post<Case[]>(url, body,
    )
      .map(res => {
        let kases:Case[] = res;
        return this.convertDates(kases);
      })
  }

  public get():Observable<Case[]>{
    let url:string = `${super.getBaseUrl()}/FetchCase`;

    return this.http.get<Case[]>(url)
      .map(res => {
        let kases:Case[] = res;

        return this.convertDates(kases);
      });
  }

  public getMock():Observable<Case[]>{
    let url:string = this.getBaseMockUrl();
    return this.http.get<Case[]>(url)
      .map(res => {
        let kases:Case[] = res;
        return this.convertDates(kases);
      });
  }

  public getOneMock(caseId:string):Observable<Case>{
    let url:string = this.getBaseMockUrl();
    return this.http.get<Case[]>(url)
      .map(res => {
        let kases:Case[] = res;
        kases = this.convertDates(kases);
        let kase:Case = kases[0];
        return kase;
      });
  }

  private convertDates(kases:Case[]){
    if( !kases || !kases.length || Object.keys(kases).length === 0 || kases[0] == undefined){
      return [];
    }
    kases.forEach( kase => {
      if(kase.caseFilingDate){
        kase.caseFilingDate = DateConverter.convertDate(kase.caseFilingDate);
      }

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

      if(kase.judicialAssignments){
        kase.judicialAssignments = kase.judicialAssignments
          .map(a => this.convertDatesForJudicialAssignment(a));
      }

    })
    return kases;
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

  public saveCaseTask(data: CaseTaskDTO):Observable<CaseTask> {
    let url:string = `${super.getBaseUrl()}/SaveCaseTask`;
    return this.http
      .post<CaseTask>(url, data)
      .map(t => this.convertCaseTaskDates(t))
  }

  convertCaseTaskDates(ct){
    ct.assignedDate = DateConverter.convertDate(ct.assignedDate);
    ct.dueDate = DateConverter.convertDate(ct.dueDate);
    return ct;
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
    options.responseType = ResponseContentType.Blob;

    return this.classicHttp
      .post(url, params, options)
      .map(response => {
        let headers = response.headers;
        let contentType = headers.get('content-type');
        let fileName = headers.get('content-disposition').split('; ')[1].split('=')[1].replace(/"/g,'');
        let result = response.arrayBuffer();
        //let data = new Blob([result], { type: contentType });
        let fileSaver:FileSaver = new FileSaver();

        fileSaver.saveAs(response.blob(), fileName);

        return result;
      });

  }

  public fetchJudicialOfficer():Observable<JudicialOfficer[]>{
    let url:string = `${super.getBaseUrl()}/FetchJudicialOfficer`;

    return this.http
      .get<JudicialOfficer[]>(url)
      .map(judges => judges.map(this.mapToRealJudicialOfficer));
  }

  private mapToRealJudicialOfficer(judge:JudicialOfficer):JudicialOfficer{
    return Object.assign(new JudicialOfficer(), judge);
  }

  public saveJudicialAssignment(data:JudicialAssignment):Observable<JudicialAssignment>{
    let url:string = `${super.getBaseUrl()}/SaveJudicialAssignment`;

    let assignment:any = {
      caseOID: data.caseOID.toString(),
      partyOID: data.judicialOfficial.partyOID.toString(),
      startDate: this.datePipe.transform(data.startDate, "yyyy-MM-dd")
    };

    if (data.endDate)
      assignment.endDate = this.datePipe.transform(data.endDate, "yyyy-MM-dd");

    if (data.judicialAssignmentOID)
      assignment.judicialAssignmentOID = data.judicialAssignmentOID.toString();

    return this.http
      .post<JudicialAssignment[]>(url,assignment)
      .map(j => this.convertDatesForJudicialAssignment(j[0]));
  }

  private convertDatesForJudicialAssignment(assignment:JudicialAssignment):JudicialAssignment{
    let ref:any = assignment;
    if(assignment.endDate){
      assignment.endDate = DateConverter.convertDate(assignment.endDate);
    }

    assignment.startDate = DateConverter.convertDate(assignment.startDate);

    return assignment;
  }

  public fetchEventType():Observable<EventType[]>{
    let url:string = `${super.getBaseUrl()}/FetchEventType`;

    return this.http
      .get<EventType[]>(url);
  }

  public saveCaseEvent(data:CaseEvent):Observable<CaseEvent>{
    var event = {
        caseOID: '',
        initiatedByPartyOID: '',
        eventTypeOID: '',
        durationTimeMin: '',
        documentTemplateOID: undefined
    };

    event.caseOID = data.caseOID.toString();
    event.initiatedByPartyOID = data.initiatedByParty.partyOID.toString();
    event.eventTypeOID = data.eventType[0].eventTypeOID;

    if (data.durationTimeMin !== null)
        event.durationTimeMin = data.durationTimeMin.toString();

    if (data.documentTemplateOID)
        event.documentTemplateOID = data.documentTemplateOID.toString();

    let url:string = `${super.getBaseUrl()}/SaveCaseEvent`;

    return this.http
      .post<CaseEvent[]>(url, event)
      .map(e => e[0]);
  }
}
