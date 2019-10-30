import { CaseTaskDTO } from '../../entities/CaseTaskDTO';
import { Injectable, forwardRef, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CaseTask } from '../../entities/CaseTask';
import { Address } from '../../entities/Address';
import { Identifier } from '../../entities/Identifier';
import { Occupation } from '../../entities/Occupation';
import { Party } from '../../entities/Party';
import { CaseHearingDeprecated } from '../../entities/CaseHearingDeprecated';
import { CaseEvent } from '../../entities/CaseEvent';
import { CaseDocument } from '../../entities/CaseDocument';
import { PhoneNumber } from '../../entities/PhoneNumber';
import { DateConverter } from '../../utils/date-converter';
import { HttpBaseService } from './http-base.service';
import { Case } from '../../entities/Case';
import { CaseHearings } from '../../entities/CaseHearings';
import { Email } from '../../entities/Email';
import { IccsCode } from '../../entities/IccsCode';
import { DatePipe } from '@angular/common';
import { CaseParty } from '../../entities/CaseParty';
import { ChargeFactor } from '../../entities/ChargeFactor';
import { ChargeFactorVariable } from '../../entities/ChargeFactorVariable';
import { ChargeFactorCategory } from '../../entities/ChargeFactorCategory';
import { CasePartyRole } from '../../entities/CasePartyRole';
import { DocTemplate } from '../../entities/DocTemplate';
import { Http, RequestOptionsArgs, Headers, ResponseContentType } from '@angular/http';
import { AuthorizationInterceptor } from '../../interceptors/authorization.interceptor';
import { JudicialOfficer } from '../../entities/JudicialOfficer';
import { JudicialAssignment } from '../../entities/JudicialAssignment';
import { FileSaver } from '../utility/file-saver.service';
import { EventType } from '../../entities/EventType';
import { CaseType } from '../../entities/CaseType';
import { CaseApplicationType } from '../../entities/CaseApplicationType';
import { CaseDispositionType } from '../../entities/CaseDispositionType';
import { CaseStatus } from '../../entities/CaseStatus';
import { CasePhase } from '../../entities/CasePhase';
import { CaseSubType } from '../../entities/CaseSubType';
import { CaseHearingDTO } from '../../entities/CaseHearingDTO';
import { LocalCharge } from '../../entities/LocalCharge';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { CaseApplication } from '../../entities/CaseApplication';
import { CaseApplicant } from '../../entities/CaseApplicant';
import { PaymentDisbursementDetails } from '../../entities//PaymentDisbursementDetails';
import { CasePayment } from '../../entities//CasePayment';
import { DocumentType } from '../../entities/DocumentType';


@Injectable()
export class CaseService extends HttpBaseService<Case> {

  private mockFile = 'cases-b.json';
  private datePipe: DatePipe = new DatePipe("en");

  // Override Base URL's set in Super
  // protected getBaseUrl():string{
  //   return `${super.getBaseUrl()}/FetchCase`;
  // }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

  constructor(
    @Inject(forwardRef(() => HttpClient)) protected http: HttpClient,
    @Inject(forwardRef(() => Http)) protected classicHttp: Http
  ) {
    super(http);
  }


  public fetchAny(obj: any): Observable<Case[]> {

    const url = `${super.getBaseUrl()}/FetchCase`;

    return this.http.post<Case[]>(url, obj)
      .map(res => {
        const kases: Case[] = res;
        return this.convertDates(kases);
      });
  }

  public fetchOne(id: string): Observable<Case> {
    const url = `${super.getBaseUrl()}/FetchCase`;

    return this.http.post<Case>(url,
      { caseOID: id })
      .map(res => {
        if (res[0] == undefined) {
          // this handles server return of [undefined]
          // an array populated with undefined
          return new Case();
        } else {
          let kase: Case = res[0];
          kase = this.convertDates([kase])[0];
          return kase;
        }
      });
  }


  public fetch(body: any): Observable<Case[]> {
    const url = `${super.getBaseUrl()}/FetchCase`;

    return this.http.post<Case[]>(url, body,
    )
      .map(res => {
        const kases: Case[] = res;
        return this.convertDates(kases);
      });
  }

  public get(): Observable<Case[]> {
    const url = `${super.getBaseUrl()}/FetchCase`;

    return this.http.get<Case[]>(url)
      .map(res => {
        const kases: Case[] = res;

        return this.convertDates(kases);
      });
  }

  public getMock(): Observable<Case[]> {
    const url: string = this.getBaseMockUrl();
    return this.http.get<Case[]>(url)
      .map(res => {
        const kases: Case[] = res;
        return this.convertDates(kases);
      });
  }

  public getOneMock(caseId: string): Observable<Case> {
    const url: string = this.getBaseMockUrl();
    return this.http.get<Case[]>(url)
      .map(res => {
        let kases: Case[] = res;
        kases = this.convertDates(kases);
        const kase: Case = kases[0];
        return kase;
      });
  }

  createAssociatedCase(caseOID: number) {
    const url = `${super.getBaseUrl()}/CreateAssociatedCase`;
    const body: any = { caseOID: caseOID.toString() };

    return this.http.post<Case>(url, body)
      .map(res => {
        const kase: Case = res;
        return this.convertDates([kase]);
      });
  }

  //This retrieves all case related information
  private convertDates(kases: Case[]) {
    if (!kases || !kases.length || Object.keys(kases).length === 0 || kases[0] == undefined) {
      return [];
    }
    kases.forEach(kase => {
      if (kase.caseFilingDate) {
        kase.caseFilingDate = DateConverter.convertDate(kase.caseFilingDate);
      }

      if (kase.caseDispositionDate) {
        kase.caseDispositionDate = DateConverter.convertDate(kase.caseDispositionDate);
      }

      let caseDocs: CaseDocument[] = kase.caseDocs;
      if (caseDocs) {
        caseDocs.forEach(cd => {
          cd.docReceived = DateConverter.convertDate(cd.docReceived);
          cd.docSent = DateConverter.convertDate(cd.docSent);
          cd.lastUpdateDate = DateConverter.convertDate(cd.lastUpdateDate);
        });
      }

      const caseEvents: CaseEvent[] = kase.caseEvents;
      if (caseEvents) {
        caseEvents.forEach(ce => {
          ce.eventDate = DateConverter.convertDate(ce.eventDate);
        });
      }

      const caseParties: CaseParty[] = kase.caseParties;
      if (caseParties) {
        caseParties.forEach(cp => {

          // Convert the Dates on the Root of the Object
          const startDate = cp.startDate;
          if (startDate) cp.startDate = DateConverter.convertDate(cp.startDate);
          const endDate = cp.endDate;
          if (endDate) cp.endDate = DateConverter.convertDate(cp.endDate);

          // Get at the Nested CaseParty --
          const caseParty = cp.caseParty;

          caseParty.dob = DateConverter.convertDate(caseParty.dob);

          const idents: Identifier[] = caseParty.identifiers;
          if (idents) {
            idents.forEach(idf => {
              idf.startDate = DateConverter.convertDate(idf.startDate);
              idf.endDate = DateConverter.convertDate(idf.endDate);
            });
          }
          let occs: Occupation[] = caseParty.occupations;
          if (occs) {
            occs.forEach(occ => {
              occ.startDate = DateConverter.convertDate(occ.startDate);
              occ.endDate = DateConverter.convertDate(occ.endDate);
            })
          }
          let addresses: Address[] = caseParty.addresses;
          if (addresses) {
            addresses.forEach(addr => {
              addr.startDate = DateConverter.convertDate(addr.startDate);
              addr.endDate = DateConverter.convertDate(addr.endDate);
            });
          }
          const emails: Email[] = caseParty.emails;
          if (emails) {
            emails.forEach(em => {
              em.startDate = DateConverter.convertDate(em.startDate);
              em.endDate = DateConverter.convertDate(em.endDate);
            });
          }
          const phones: PhoneNumber[] = caseParty.phoneNumbers;
          if (phones) {
            phones.forEach(ph => {
              ph.startDate = DateConverter.convertDate(ph.startDate);
              ph.endDate = DateConverter.convertDate(ph.endDate);
            });
          }

          const now: Date = new Date();
          let age = 0;

          const dob = caseParty.dob;
          if (dob) {
            if (dob.getMonth() == now.getMonth()) {
              if (dob.getDate() > now.getDate()) {
                age = now.getFullYear() - dob.getFullYear() - 1;
              } else {
                age = now.getFullYear() - dob.getFullYear();
              }
            } else if (dob.getMonth() > now.getMonth()) {
              age = now.getFullYear() - dob.getFullYear() - 1;
            } else {
              age = now.getFullYear() - dob.getFullYear();
            }
          }

          caseParty.age = age;

        });
      }

      const caseTasks: CaseTask[] = kase.caseTasks;
      if (caseTasks) {
        caseTasks.forEach(ct => {
          ct.assignedDate = DateConverter.convertDate(ct.assignedDate);
          ct.taskDueDate = DateConverter.convertDate(ct.taskDueDate);
          ct.taskDoneDate = DateConverter.convertDate(ct.taskDoneDate);
        });
      }

      let casePayments: CasePayment[] = kase.casePayments;
      if (casePayments) {
        casePayments.forEach(ct => {
          ct.dateOfPayment = DateConverter.convertDate(ct.dateOfPayment);
          ct.disbursementDate = DateConverter.convertDate(ct.disbursementDate);
          
          
        })
      }

      let caseHearings: CaseHearingDeprecated[] = kase.caseHearings;
      if (caseHearings) {
        caseHearings.forEach(ch => {
          ch.startDateTime = DateConverter.convertDate(ch.startDateTime);
          ch.endDateTime = DateConverter.convertDate(ch.endDateTime);
        });
      }

      if (kase.judicialAssignments) {
        kase.judicialAssignments = kase.judicialAssignments
          .map(a => this.convertDatesForJudicialAssignment(a));
      }

    });
    return kases;
  }

  public fetchICCSCategory(iccsCodeOID: number = null): Observable<IccsCode[]> {
    const url = `${super.getBaseUrl()}/FetchICCSCategory`;

    let params: Object = "";

    if (iccsCodeOID) {
      params = { iccsCodeOID: iccsCodeOID.toString() };
    }

    return this.http.post<IccsCode[]>(url, params);
  }

  public fetchChargeFactor(): Observable<ChargeFactor[]> {
    const url = `${super.getBaseUrl()}/FetchChargeFactor`;

    return this.http.post<ChargeFactor[]>(url, "");
  }

  //RS Implementing Charge Factor Variables ---- This needs to be implemented on the BackEnd of in the Service Folder
  public fetchChargeFactorVariables(): Observable<ChargeFactorVariable[]> {
    const url = `${super.getBaseUrl()}/FetchChargeFactorVariables`;

    return this.http.post<ChargeFactorVariable[]>(url, "");
  }

  //RS Implementing Charge Factor Category ---- This needs to be implemented on the BackEnd of in the Service Folder
  public fetchChargeFactorCategory(): Observable<ChargeFactorCategory[]> {
    const url = `${super.getBaseUrl()}/FetchChargeFactorCategory`;

    return this.http.post<ChargeFactorCategory[]>(url, "");
  }

  public fetchLocalCharge(): Observable<LocalCharge[]> {
    const url = `${super.getBaseUrl()}/FetchLocalCharge`;

    return this.http
      .post<LocalCharge[]>(url, "");
  }

  public saveCourtCase(data: Case): Observable<Case> {


    //Takes data from the UI, needs to parse to json string and pass it to server

    let caseData: any = {
      caseCaption: data.caseCaption || '',
      caseFilingDate: null,
      caseDispositionDate: null,
      caseType: null,
      caseDispositionType: null,
      caseStatus: null,
      casePhase: null,
      caseSubType: null,
      caseWeight: "0",
      caseParties: [],
      caseCharges: [],
      prevCaseNumber: null,
      courtOfAppealNumber: null,
      caseNotes: null
    };

    if (data.prevCaseNumber)
      caseData.prevCaseNumber = data.prevCaseNumber.toString();
    if (data.caseNotes)
      caseData.caseNotes = data.caseNotes.toString();
    if (data.courtOfAppealNumber)
      caseData.courtOfAppealNumber = data.courtOfAppealNumber.toString();
    if (data.caseOID)
      caseData.caseOID = data.caseOID.toString();
    if (data.caseFilingDate)
      caseData.caseFilingDate = this.datePipe.transform(data.caseFilingDate, "yyyy-MM-dd");
    if (data.caseDispositionDate){
       caseData.caseDispositionDate = this.datePipe.transform(data.caseDispositionDate, "yyyy-MM-dd");
    }      
    if (data.caseType)
      caseData.caseType = data.caseType.caseTypeOID.toString();
    if (data.caseDispositionType){
      caseData.caseDispositionType = data.caseDispositionType.caseDispositionTypeOID.toString();  
    }
    if (data.caseStatus)
      caseData.caseStatus = data.caseStatus.statusOID.toString();
    if (data.casePhase)
      caseData.casePhase = data.casePhase.casePhaseOID.toString();
    if (data.caseSubType)
      caseData.caseSubType = data.caseSubType.caseSubTypeOID.toString();
    if (data.caseWeight)
      caseData.caseWeight = data.caseWeight.toString();

    //Save Case Parties
    if (data.caseParties.length > 0) {
      data.caseParties.forEach(value => {
        let party = {
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

        let charge: any = {
          iccsCodeOID: value.iccsCode.iccsCodeOID.toString(),
          lea: value.leaChargingDetails,
          factors: [],
          factorCategory: [],
          factorVariable: []
        };

        if (value.localCharge)
          charge.localChargeOID = value.localCharge.localChargeOID.toString();

        /*value.chargeFactors.forEach(factor => {
        charge.chargeFactors.push(factor.chargeFactorOID.toString());
        });

        //RS
        value.chargeFactorCategory.forEach(factorCategory => {
        charge.chargeFactorCategory.push(factorCategory.chargeFactorCategoryId.toString());

        });

        value.chargeFactorVariables.forEach(factorVariable => {
        charge.chargeFactorVariables.push(factorVariable.chargeFactorVariableID.toString());
        });
        //RS*/


        caseData.caseCharges.push(charge);
      });


  
    }

    const url = `${super.getBaseUrl()}/SaveCourtCase`;

    return this.http
      .post<Case[]>(url, caseData)
      .map(c => this.convertDates(c)[0]);
  }

  public saveCaseTask(data: CaseTaskDTO): Observable<CaseTask> {
    const url = `${super.getBaseUrl()}/SaveCaseTask`;
    return this.http
      .post<CaseTask>(url, data)
      .map(t => this.convertCaseTaskDates(t));
  }

  //This calls the CaseApplicationResrouce in the BackEnd
  public saveCaseApplication(data: CaseApplication): Observable<CaseApplication> {
    const url = `${super.getBaseUrl()}/SaveCaseApplication`;
    return this.http
      .post<CaseApplication>(url, data)
      .map(ct => this.convertCaseApplicationDates(ct))
  }

  convertCaseApplicationDates(ct){
    ct.caseApplicationStartDate = DateConverter.convertDate(ct.caseApplicationStartDate);
    ct.dateOfMarriage = DateConverter.convertDate(ct.dateOfMarriage);
    ct.caseApplicationEndDate = DateConverter.convertDate(ct.caseApplicationEndDate);
    return ct;
  }

  //This calls the CaseApplicationResrouce in the BackEnd
  public saveCasePayment(data: CasePayment): Observable<CasePayment> {
    let url: string = `${super.getBaseUrl()}/SaveCasePayment`;
    return this.http
      .post<CasePayment>(url, data)
      .map(ct => this.convertCasePaymentDetailDates(ct))
  }

  convertCasePaymentDetailDates(ct){

    ct.dateOfPayment = DateConverter.convertDate(ct.dateOfPayment);
    ct.disbursementDate = DateConverter.convertDate(ct.disbursementDate);

    for (let i = 0; i < ct.paymentsDisbursements.length; i++){        
      ct.paymentsDisbursements[i].paymentPeriodStartDate = DateConverter.convertDate(ct.paymentsDisbursements[i].paymentPeriodStartDate);
      ct.paymentsDisbursements[i].paymentPeriodEndDate = DateConverter.convertDate(ct.paymentsDisbursements[i].paymentPeriodEndDate);
    }
    return ct;
  }

  convertCaseTaskDates(ct) {
    ct.assignedDate = DateConverter.convertDate(ct.assignedDate);
    ct.dueDate = DateConverter.convertDate(ct.dueDate);
    ct.doneDate = DateConverter.convertDate(ct.doneDate);
    return ct;
  }

  public fetchCasePartyRole(): Observable<CasePartyRole[]> {
    const url = `${super.getBaseUrl()}/FetchCasePartyRole`;

    return this.http
      .get<CasePartyRole[]>(url);
  }

  public fetchDocumentTemplate(): Observable<DocTemplate[]> {

    const url = `${super.getBaseUrl()}/FetchDocumentTemplate`;
    return this.http
      .get<DocTemplate[]>(url);
  }

  //RS
  public fetchCaseTasks(): Observable<CaseTask[]> {

    const url = `${super.getBaseUrl()}/FetchCaseTasks`;
    return this.http
      .get<CaseTask[]>(url);
  }

  public saveCaseHearing(data: CaseHearingDTO): Observable<CaseHearingDeprecated> {
    const url = `${super.getBaseUrl()}/SaveCaseHearing`;
    return this.http
      .post<CaseHearingDeprecated>(url, data)
      .map(h => this.convertHearingDates(h));
  }

  convertHearingDates(item: CaseHearingDeprecated) {
    item.startDateTime = DateConverter.convertDate(item.startDateTime);
    item.endDateTime = DateConverter.convertDate(item.endDateTime);
    return item;
  }

  // public downloadCourtDocument(caseOID: number, documentTemplateOID: number): Observable<ArrayBuffer> {
  //   let url: string = `${super.getBaseUrl()}/GenerateCourtDocument`;
  //   let params: object = {
  //     caseOID: caseOID.toString(),
  //     documentTemplateOID: documentTemplateOID.toString()
  //   };

  //   let options: RequestOptionsArgs = {}
  //   let headers: Headers = new Headers();

  //   headers.append("token", AuthorizationInterceptor.authToken);
  //   headers.append("Authorization", `Bearer ${AuthorizationInterceptor.authToken}`);

  //   options.headers = headers;
  //   options.responseType = ResponseContentType.Blob;

  //   return this.classicHttp
  //     .post(url, params, options)
  //     .map(response => {
  //       let headers = response.headers;
  //       let contentType = headers.get('content-type');
  //       let fileName = headers.get('content-disposition').split('; ')[1].split('=')[1].replace(/"/g, '');
  //       let result = response.arrayBuffer();
  //       //let data = new Blob([result], { type: contentType });
  //       let fileSaver: FileSaver = new FileSaver();

  //       fileSaver.saveAs(response.blob(), fileName);

  //       return result;
  //     });

  // }

  public downloadCourtDocument(
    caseOID: number,
    docName: string,
    docFileName: string
  ): Observable<ArrayBuffer> {
    const url = `${super.getBaseUrl()}/GenerateCourtDocument`;
    const params: object = {
      caseOID: caseOID.toString(),
      name: docName,
      filename: docFileName
      // documentTemplateOID: documentTemplateOID.toString()

    };

    const options: RequestOptionsArgs = {};
    const headers: Headers = new Headers();

    headers.append("token", AuthorizationInterceptor.authToken);
    headers.append(
      "Authorization",
      `Bearer ${AuthorizationInterceptor.authToken}`
    );

    options.headers = headers;
    options.responseType = ResponseContentType.Blob;

    return this.classicHttp.post(url, params, options).map(response => {
      const headers = response.headers;
      const contentType = headers.get("content-type");
      const fileName = headers
        .get("content-disposition")
        .split("; ")[1]
        .split("=")[1]
        .replace(/"/g, "");
      const result = response.arrayBuffer();
      // let data = new Blob([result], { type: contentType });
      const fileSaver: FileSaver = new FileSaver();

      fileSaver.saveAs(response.blob(), fileName);

      return result;
    });
  }

  public fetchNewDocTypesFull(): Observable<DocumentType[]> {
    const url = `${super.getBaseUrl()}/api/new-doc-types-full`;

    return this.http.get<DocumentType[]>(url);
  }

  public fetchNewDocTypes(category: String): Observable<String[]> {
    const url = `${super.getBaseUrl()}/api/new-doc-types/${category}`;

    return this.http.get<String[]>(url);
  }

  /* Deprecated
      on 10/5/2018 by Jeff
      use the more efficient getJudicialOfficers()

  public fetchJudicialOfficer(): Observable<JudicialOfficer[]> {
    let url: string = `${super.getBaseUrl()}/FetchJudicialOfficer`;

    return this.http
      .get<JudicialOfficer[]>(url)
      .map(judges => judges.map(this.mapToRealJudicialOfficer));
  }
  */

  public getJudicialOfficers(): Observable<JudicialOfficer[]> {
    const url = `${super.getBaseUrl()}/api/judicial-officers`;
    return this.http
      .get<JudicialOfficer[]>(url)
      .map(judges => judges.map(this.mapToRealJudicialOfficer));
  }

  private mapToRealJudicialOfficer(judge: JudicialOfficer): JudicialOfficer {
    judge.name = `${judge.firstName} ${judge.lastName}`;
    judge.partyOID = judge.id;
    return Object.assign(new JudicialOfficer(), judge);
  }

  public saveJudicialAssignment(data: JudicialAssignment): Observable<JudicialAssignment> {
    const url = `${super.getBaseUrl()}/SaveJudicialAssignment`;

    const assignment: any = {
      caseOID: data.caseOID.toString(),
      partyOID: data.judicialOfficial.partyOID.toString(),
      startDate: this.datePipe.transform(data.startDate, "yyyy-MM-dd")
    };

    if (data.endDate) {
      assignment.endDate = this.datePipe.transform(data.endDate, "yyyy-MM-dd");
    }

    if (data.judicialAssignmentOID) {
      assignment.judicialAssignmentOID = data.judicialAssignmentOID.toString();
    }

    return this.http
      .post<JudicialAssignment[]>(url, assignment)
      .map(j => this.convertDatesForJudicialAssignment(j[0]));
  }

  private convertDatesForJudicialAssignment(assignment: JudicialAssignment): JudicialAssignment {
    const ref: any = assignment;
    if (assignment.endDate) {
      assignment.endDate = DateConverter.convertDate(assignment.endDate);
    }

    assignment.startDate = DateConverter.convertDate(assignment.startDate);

    return assignment;
  }

  public fetchEventType(): Observable<EventType[]> {
    const url = `${super.getBaseUrl()}/FetchEventType`;

    return this.http
      .get<EventType[]>(url);
  }

  public saveCaseEvent(data: CaseEvent): Observable<CaseEvent> {
    let event = {
      caseOID: '',
      initiatedByPartyOID: '',
      eventTypeOID: '',
      durationTimeMin: '',
      documentTemplateOID: undefined,
      caseEventOID: undefined,
      description: ''
    };

    event.caseOID = data.caseOID.toString();
    event.initiatedByPartyOID = data.initiatedByParty ? data.initiatedByParty.partyOID.toString() : null;
    event.eventTypeOID = data.eventType.eventTypeOID.toString();
    event.description = data.description;

    if (data.caseEventOID) {
      event.caseEventOID = data.caseEventOID.toString();
    }

    if (data.durationTimeMin || data.durationTimeMin === 0)
      event.durationTimeMin = data.durationTimeMin.toString();

    if (data.docTemplate)
      event.documentTemplateOID = data.docTemplate.documentTemplateOID.toString();

    const url = `${super.getBaseUrl()}/SaveCaseEvent`;

    return this.http
      .post<CaseEvent[]>(url, event)
      .map(e => e[0]);
  }

  public fetchCaseType(): Observable<CaseType[]> {
    const url = `${super.getBaseUrl()}/FetchCaseType`;

    return this.http
      .get<CaseType[]>(url);
  }

  public fetchCaseApplicationType(): Observable<CaseApplicationType[]> {
    const url = `${super.getBaseUrl()}/FetchCaseApplicationType`;

    return this.http
      .get<CaseApplicationType[]>(url);
  }
  
  public fetchCaseDispositionType(): Observable<CaseDispositionType[]> {
    
    let url: string = `${super.getBaseUrl()}/FetchCaseDispositionTypes`;
    return this.http
      .get<CaseDispositionType[]>(url);
  }

  public fetchCaseStatus(): Observable<CaseStatus[]> {
    const url = `${super.getBaseUrl()}/FetchCaseStatus`;

    return this.http
      .get<CaseStatus[]>(url);
  }

  public fetchPhaseByType(type: number): Observable<CasePhase[]> {
    const url = `${super.getBaseUrl()}/FetchPhaseByType`;

    const params: object = {
      typeOID: type.toString()
    };

    return this.http
      .post<CasePhase[]>(url, params);
  }

  public fetchCaseSubType(type: number): Observable<CaseSubType[]> {
    const url = `${super.getBaseUrl()}/FetchCaseSubType`;

    const params: object = {
      typeOID: type.toString()
    };

    return this.http
      .post<CaseSubType[]>(url, params);
  }

  public fetchHearing(data: any): Observable<CaseHearingDeprecated[]> {
    const url = `${super.getBaseUrl()}/FetchHearing`;

    return this.http
      .post<CaseHearingDeprecated[]>(url, data);
  }

  //This fetches all the case applications for a specific case
  public fetchCaseApplication(caseNum: number): Observable<CaseApplication[]> {
    const url = `${super.getBaseUrl()}/FetchCaseApplication`;

    const params: object = {
      caseOID: caseNum.toString()
    };

    return this.http.post<CaseApplication[]>(url, params);
  }

  //This fetches all the case applications for a specific case
  public fetchCasePayments(caseNum: number): Observable<CasePayment[]> {
    let url: string = `${super.getBaseUrl()}/FetchCasePayments`;

    let params: object = {
      caseOID: caseNum.toString()
    }

    return this.http.post<CasePayment[]>(url, params);
  }  

 //This fetches all the case payment details
 public fetchCasePaymentDetails(caseNum: number): Observable<PaymentDisbursementDetails[]> {
  let url: string = `${super.getBaseUrl()}/FetchCasePaymentDetails`;

  let params: object = {
    caseOID: caseNum.toString()
  }

  return this.http.post<PaymentDisbursementDetails[]>(url, params);
}    
  //This fetches all the applications for a specific case application
  /*public fetchCaseApplicants(applicationNum: number): Observable<CaseApplicant[]> {
    let url: string = `${super.getBaseUrl()}/FetchCaseApplicant`;

    const params: object = {
      caseApplicationOID: applicationNum.toString()
    };

    return this.http.post<CaseApplicant[]>(url, params);
  }*/

  public fetchDocket(): Observable<Case[]> {
    const url = `${super.getBaseUrl()}/FetchDocket`;

    return this.http.get<Case[]>(url);
  }

}
