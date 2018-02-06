import { Inject, Injectable, forwardRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

import { CourtLocation } from './../../entities/CourtLocation';
import { CaseEvent } from './../../entities/CaseEvent';
import { Identifier } from './../../entities/Identifier';
import { CasePartyRole } from './../../entities/CasePartyRole';
import { CaseStatus } from './../../entities/CaseStatus';
import { CaseType } from './../../entities/CaseType';
import { CasePhase } from '../../entities/CasePhase';
import { IccsCode } from '../../entities/IccsCode';
import { CaseHearing } from '../../entities/CaseHearing';
import { EventType } from '../../entities/EventType';
import { HearingType } from '../../entities/HearingType';


@Injectable()
export class AdminDataService {

  public static authenticationToken:string = null;

  protected getBaseUrl():string{
    return `${environment.apiUrl}`;
  }

  protected getBaseMockUrl():string{
    return `${environment.mockUrl}`;
  }

  constructor(@Inject(forwardRef(() => HttpClient)) protected http:HttpClient){}


  fetchLookup<T>(endpoint: string):Observable<T[]> {
    let url: string = this.getBaseUrl() +'/'+ endpoint;

    return this.http.get<T[]>(url);
  }

  fetchPhaseByTypeLookup<T>(caseTypeOID):Observable<T[]> {
    let url: string = this.getBaseUrl() + '/FetchPhaseByType';

    return this.http.post<T[]>(
      url,
      { typeOID: caseTypeOID },
      { headers:
        { uiVersion: "2" }
      }
    );
  }

  /**
   *
   * @name saveCaseType
   * @param data
   * // caseTypeOID:"1"
    // description:null
    // name:"Hearing & Management Type"
   */
  saveCaseType(data:CaseType):Observable<CaseType> {
    let url: string = this.getBaseUrl() +'/SaveCaseType';
    let obj = {
      caseTypeOID: data.caseTypeOID ? data.caseTypeOID.toString() : null,
      name: data.name,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<CaseType>(
      url,
      obj,
      { headers: {uiVersion:"2"}}
    )
  }


  /**
   *
   * @name saveCasePhase
   * @param data
    // casePhaseOID:"2"
    // caseTypeOID:"1"
    // description:null
    // name:"Hearing & Management Type"
   */
  saveCasePhase(data:CasePhase):Observable<CasePhase> {
    let url: string = this.getBaseUrl() +'/SaveCasePhase';
    let obj = {
      casePhaseOID: data.casePhaseOID ? data.casePhaseOID.toString() : null,
      caseTypeOID: data.caseTypeOID,
      name: data.name,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<CasePhase>(
      url,
      obj,
      { headers: {uiVersion:"2"}}
    )
  }

  /**
   * @name SaveCaseStatus
   * @param data
     statusOID:"2"
     description:null
     name:"Bail Granted Type"
   */
  saveCaseStatus(data:CaseStatus):Observable<CaseStatus> {
    let url: string = this.getBaseUrl() +'/SaveCaseStatus';
    let obj = {
      statusOID: data.statusOID ? data.statusOID.toString() : null,
      name: data.name,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<CaseStatus>(
      url,
      obj,
      { headers: {uiVersion:"2"}}
    )
  }

  /**
   * @name saveCasePartyRole
   * @param data
   * // casePartyRoleOID:"4"
    // codefendantIndicator:"0"
    // description:"notes"
    // name:"Parent"
   */
  saveCasePartyRole(data:CasePartyRole):Observable<CasePartyRole> {
    let url: string = this.getBaseUrl() +'/SaveCasePartyRole';
    let obj = {
      casePartyRoleOID: data.casePartyRoleOID ? data.casePartyRoleOID.toString() : null,
      name: data.name,
      description: data.description ? data.description.toString() : null,
      codefendantIndicator: data.codefendantIndicator
    };

    return this.http.post<CasePartyRole>(
      url,
      obj,
      { headers: {uiVersion:"2"}}
    )
  }



  // TODO: this method needs to be completed
  // partyIdentifierOID: number;
  // partyOID: number;
  // identifierType: string;
  // identifierValue: string;
  // notes:string;
  // description: string;

  savePersonalIdentifier(data:Identifier):Observable<Identifier> {
    let url: string = this.getBaseUrl() +'/SavePersonalID-----Type';
    let obj = {
      partyIdentifierOID: data.partyIdentifierOID ? data.partyIdentifierOID.toString() : null,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<Identifier>(
      url,
      obj,
      { headers: {uiVersion:"2"}}
    )
  }

  /**
   * @name saveICCSCode
   * @param data
    // categoryIdentifier:"Test CatID"
    // categoryName:"Test Cat Name"
    // categoryType:"1"
    // parentOID:null
   */
  saveICCSCode(data:IccsCode):Observable<IccsCode> {
    let url: string = this.getBaseUrl() +'/SaveICCSCode';
    let obj = {
      iccsCodeOID: data.iccsCodeOID ? data.iccsCodeOID.toString() : null,
      categoryName: data.categoryName,
      categoryType: data.categoryType,
      categoryIdentifier: data.categoryIdentifier,
      parentOID: data.parentOID ? data.parentOID.toString() : null,
    };

    return this.http.post<IccsCode>(
      url,
      obj,
      { headers: {uiVersion:"2"}}
    )
  }

  /**
   * @name saveEventType
   * @param data
    // description:"Summons Withdrawn - Rule 8.4(1)"
    // eventCategoryText:"Case"
    // eventTypeName:"SMW1"
    // eventTypeOID:null
   */
  saveEventType(data:EventType):Observable<EventType> {
    let url: string = this.getBaseUrl() +'/SaveEventType';
    let obj = {
      eventTypeOID: data.eventTypeOID ? data.eventTypeOID.toString() : null,
      eventTypeName: data.eventTypeName,
      eventCategoryText: data.eventCategoryText,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<EventType>(
      url,
      obj,
      { headers: {uiVersion:"2"}}
    )
  }


  /**
   * @name saveHearingType
   * @param data
    // description:"Case hearing description"
    // durationInMinutes:"60"
    // hearingName:"Case Hearing"
    // hearingTypeOID:"3"
   */
  saveHearingType(data:HearingType):Observable<HearingType> {
    let url: string = this.getBaseUrl() +'/SaveHearingType';
    let obj = {
      hearingTypeOID: data.hearingTypeOID ? data.hearingTypeOID.toString() : null,
      hearingName: data.hearingName,
      durationInMinutes: data.durationInMinutes,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<HearingType>(
      url,
      obj,
      { headers: {uiVersion:"2"}}
    )
  }

  /**
   * @name saveCourtLocationType
   * @param data
   * locationID:"Courtroom 1"
     locationName:"Courtroom #1"
     locationOID:"1"
   */
  saveCourtLocationType(data:CourtLocation):Observable<CourtLocation> {
    let url: string = this.getBaseUrl() +'/SaveCourtLocation';
    let obj = {
      locationOID: data.locationOID ? data.locationOID.toString() : null,
      locationName: data.locationName,
      locationID: data.locationID
    };

    return this.http.post<CourtLocation>(
      url,
      obj,
      { headers: {uiVersion:"2"}}
    )
  }




  public getMock(fileName) {
    let url: string = this.getBaseMockUrl() + fileName;

    return this.http.get(url)
  }




}
