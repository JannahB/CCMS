import { DateValidatorService } from '../utility/dates/date-validator.service';
import { Inject, Injectable, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

import { CourtLocation } from '../../entities/CourtLocation';
import { CaseEvent } from '../../entities/CaseEvent';
import { Identifier } from '../../entities/Identifier';
import { CasePartyRole } from '../../entities/CasePartyRole';
import { CaseStatus } from '../../entities/CaseStatus';
import { CaseType } from '../../entities/CaseType';
import { StaffRole } from './../../entities/StaffRole';
import { Court } from './../../entities/Court';
import { CasePhase } from '../../entities/CasePhase';
import { IccsCode } from '../../entities/IccsCode';
import { EventType } from '../../entities/EventType';
import { HearingType } from '../../entities/HearingType';
import { EventWorkflow } from '../../entities/EventWorkflow';
import { TaskType } from '../../entities/TaskType';
import { StaffRolePermission } from '../../entities/StaffRolePermission';
import { StaffPool } from '../../entities/StaffPool';
import { PersonIdType } from '../../entities/PersonIdType';


@Injectable()
export class AdminDataService {

  public static authenticationToken: string = null;

  protected getBaseUrl(): string {
    return `${environment.apiUrl}`;
  }

  protected getBaseMockUrl(): string {
    return `${environment.mockUrl}`;
  }

  constructor(@Inject(forwardRef(() => HttpClient)) protected http: HttpClient) { }


  fetchLookup<T>(endpoint: string): Observable<T[]> {
    const url: string = this.getBaseUrl() + '/' + endpoint;
    console.log(url);
    return this.http.get<T[]>(url);
  }

  refreshLookupTables() {
    const url: string = this.getBaseUrl() + '/RefreshLookupTables';

    return this.http.post(
      url,
      {
      }
    );
  }


  public fetchPhaseByTypeLookup<T>(caseTypeOID: string | number): Observable<T[]> {
    const url: string = this.getBaseUrl() + '/FetchPhaseByType';

    return this.http.post<T[]>(
      url,
      { typeOID: caseTypeOID.toString() }
    );
  }


  // FetchICCSCodeParent
  // {categoryType: "1"}
  /**
   *
   * @param categoryTypeOID
   */
  fetchICCSCodeParent<T>(categoryTypeOID): Observable<T[]> {
    if (!categoryTypeOID) {
      return;
    }
    const url: string = this.getBaseUrl() + '/FetchICCSCodeParent';
    categoryTypeOID = categoryTypeOID.toString();

    return this.http.post<T[]>(
      url,
      { categoryType: categoryTypeOID }
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
  saveCaseType(data: CaseType): Observable<CaseType> {
    const url: string = this.getBaseUrl() + '/SaveCaseType';
    const obj = {
      caseTypeOID: data.caseTypeOID ? data.caseTypeOID.toString() : null,
      name: data.name,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<CaseType>(
      url,
      obj,
    );
  }

  /**
 *
 * @name saveRolePermission
 * @param data
 *     data:StaffRolePermission;
 */
  saveRolePermission(data: StaffRolePermission): Observable<StaffRolePermission> {
    let url: string = this.getBaseUrl() + '/SaveRolePermission';

    data.permissionsState.forEach(checkablePerm => {
      let index: number = data.permissions.findIndex(dataPerm => dataPerm.permissionOID == checkablePerm.permission.permissionOID);
      if (checkablePerm.checked == true) {
        // add if not found
        if (index < 0) {
          data.permissions.push(checkablePerm.permission);
        }
      } else {
        // remove if found
        if (index >= 0) {
          data.permissions.splice(index, 1);
        }
      }
    });

    let obj = {
      courtOID: data.courtOID ? data.courtOID.toString() : null,
      staffRoleOID: data.staffRoleOID ? data.staffRoleOID.toString() : null,
      staffRoleName: data.staffRoleName,
      permissions: data.permissions,
      ccmsAdmin: data.ccmsAdmin,
      judicialOfficer: data.judicialOfficer,
    };

    console.log(obj);

    return this.http.post<StaffRolePermission>(
      url,
      obj,
      { headers: { uiVersion: "2" } }
    )
  }

  /**
   *
   * @name saveCourt
   * @param data
   * courtName: string;
   * courtOID: number;
   * locationCode: string;
   */
  saveCourt(data: Court): Observable<Court> {
    let url: string = this.getBaseUrl() + '/SaveCourt';

    let obj = {
      courtOID: data.courtOID ? data.courtOID.toString() : null,
      courtName: data.courtName,
      locationCode: data.locationCode,
    };

    return this.http.post<Court>(
      url,
      obj,
      { headers: { uiVersion: "2" } }
    )
  }


  /**
 *
 * @name saveStaffRole
 * @param data
 * courtOID: number = 0;
 * ccmsAdmin: boolean = false;
 * judicialOfficer: boolean = false;
 * staffRoleName: string = "";
 * staffRoleOID: number = 0;
 */
  saveStaffRole(data: StaffRole): Observable<StaffRole> {
    let url: string = this.getBaseUrl() + '/SaveStaffRole';

    let obj = {
      staffRoleOID: data.staffRoleOID ? data.staffRoleOID.toString() : null,
      staffRoleName: data.staffRoleName,
      ccmsAdmin: data.ccmsAdmin,
      judicialOfficer: data.judicialOfficer,
      courtOID: data.courtOID ? data.courtOID.toString() : null,
    };

    return this.http.post<StaffRole>(
      url,
      obj,
      { headers: { uiVersion: "2" } }
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
  saveCasePhase(data: CasePhase): Observable<CasePhase> {
    const url: string = this.getBaseUrl() + '/SaveCasePhase';
    const obj = {
      casePhaseOID: data.casePhaseOID ? data.casePhaseOID.toString() : null,
      caseTypeOID: data.caseTypeOID ? data.caseTypeOID.toString() : null,
      name: data.name,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<CasePhase>(
      url,
      obj,
    );
  }

  /**
   * @name SaveCaseStatus
   * @param data
     statusOID:"2"
     description:null
     name:"Bail Granted Type"
   */
  saveCaseStatus(data: CaseStatus): Observable<CaseStatus> {
    const url: string = this.getBaseUrl() + '/SaveCaseStatus';
    const obj = {
      statusOID: data.statusOID ? data.statusOID.toString() : null,
      name: data.name,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<CaseStatus>(
      url,
      obj,
    );
  }

  /**
   * @name saveCasePartyRole
   * @param data
   * // casePartyRoleOID:"4"
    // codefendantIndicator:"0"
    // description:"notes"
    // name:"Parent"
   */
  saveCasePartyRole(data: CasePartyRole): Observable<CasePartyRole> {
    const url: string = this.getBaseUrl() + '/SaveCasePartyRole';

    const obj = {
      casePartyRoleOID: data.casePartyRoleOID ? data.casePartyRoleOID.toString() : null,
      name: data.name,
      description: data.description ? data.description.toString() : null,
      codefendantIndicator: data.codefendantIndicator ? '1' : '0'
    };

    return this.http.post<CasePartyRole>(
      url,
      obj,
    );
  }



  // TODO: this method needs to be completed
  // partyIdentifierOID: number;
  // partyOID: number;
  // identifierType: string;
  // identifierValue: string;
  // notes:string;
  // description: string;

  savePersonalIdentifier(data: Identifier): Observable<Identifier> {
    const url: string = this.getBaseUrl() + '/SavePersonalIDType';
    const obj = {
      partyIdentifierOID: data.partyIdentifierOID ? data.partyIdentifierOID.toString() : null,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<Identifier>(
      url,
      obj,
    );
  }

  /**
   * @name saveICCSCode
   * @param data
    // categoryIdentifier:"Test CatID"
    // categoryName:"Test Cat Name"
    // categoryType:"1"
    // parentOID:null
   */
  saveICCSCode(data: IccsCode): Observable<IccsCode> {
    const url: string = this.getBaseUrl() + '/SaveICCSCode';
    const obj = {
      iccsCodeOID: data.iccsCodeOID ? data.iccsCodeOID.toString() : null,
      categoryName: data.categoryName,
      categoryType: data.categoryType,
      categoryIdentifier: data.categoryIdentifier,
      parentOID: data.parentOID ? data.parentOID.toString() : null,
    };

    return this.http.post<IccsCode>(
      url,
      obj,
    );
  }

  /**
   * @name saveEventType
   * @param data
    // description:"Summons Withdrawn - Rule 8.4(1)"
    // eventCategoryText:"Case"
    // eventTypeName:"SMW1"
    // eventTypeOID:null
   */
  saveEventType(data: EventType): Observable<EventType> {
    const url: string = this.getBaseUrl() + '/SaveEventType';
    const obj = {
      eventTypeOID: data.eventTypeOID ? data.eventTypeOID.toString() : null,
      eventTypeName: data.eventTypeName,
      eventCategoryText: data.eventCategoryText,
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<EventType>(
      url,
      obj
    );
  }


  /**
   * @name saveHearingType
   * @param data
    // description:"Case hearing description"
    // durationInMinutes:"60"
    // hearingName:"Case Hearing"
    // hearingTypeOID:"3"
   */
  saveHearingType(data: HearingType): Observable<HearingType> {
    const url: string = this.getBaseUrl() + '/SaveHearingType';
    const obj = {
      hearingTypeOID: data.hearingTypeOID ? data.hearingTypeOID.toString() : null,
      hearingName: data.hearingName,
      durationInMinutes: data.durationInMinutes ? data.durationInMinutes.toString() : '0',
      description: data.description ? data.description.toString() : null,
    };

    return this.http.post<HearingType>(
      url,
      obj
    );
  }

  // This is for testing new EP - not used yet-------------
  saveHearingTypeNew(data: HearingType): Observable<HearingType> {
    const url: string = this.getBaseUrl() + '/api/hearing-types';
    const obj = {
      id: data.hearingTypeOID ? data.hearingTypeOID.toString() : null,
      name: data.hearingName,
      durationMin: data.durationInMinutes ? data.durationInMinutes.toString() : '0',
      description: data.description ? data.description.toString() : null,
      courtId: data.courtOID
    };

    if (obj.id) {
      return this.http.put<HearingType>(url, obj);
    } else {
      return this.http.post<HearingType>(url, obj);
    }
  }

  /**
   * @name saveCourtLocationType
   * @param data
   * locationID:"Courtroom 1"
     locationName:"Courtroom #1"
     locationOID:"1"
   */
  saveCourtLocationType(data: CourtLocation): Observable<CourtLocation> {
    const url: string = this.getBaseUrl() + '/SaveCourtLocation';
    const obj = {
      locationOID: data.locationOID ? data.locationOID.toString() : null,
      locationName: data.locationName,
      locationID: data.locationID
    };

    return this.http.post<CourtLocation>(
      url,
      obj
    );
  }

  fetchEventWorkflow(eventTypeOID: number): Observable<EventWorkflow> {
    const url = `${this.getBaseUrl()}/FetchEventWorkflow`;

    return this.http
      .post<EventWorkflow>(url, { 'eventTypeOID': eventTypeOID.toString() });
  }

  saveEventWorkflow(data: EventWorkflow): Observable<EventWorkflow> {
    // let workflow = {
    //   eventWorkflowOID: eventWorkflow.eventWorkflowOID ? eventWorkflow.eventWorkflowOID.toString() : undefined,
    //   description: eventWorkflow.description ? eventWorkflow.description : undefined,
    //   triggeringEventOID: eventWorkflow.triggeringEvent.eventTypeOID.toString(),
    //   workflowSteps: eventWorkflow.workflowSteps ? eventWorkflow.workflowSteps
    //     .map(step => {
    //       return {
    //         workflowStepOID: step.workflowStepOID ? step.workflowStepOID.toString() : undefined,
    //         assignedPartyOID: step.assignedParty ? step.assignedParty.partyOID.toString() : undefined,
    //         delayDays: step.delayDays.toString(),
    //         documentTemplateOID: step.documentTemplateOID ? step.documentTemplateOID.toString() : undefined,
    //         taskTypeOID: step.taskType.taskTypeOID.toString()
    //       }
    //     }) : []
    // }

    const workflow = {workflowSteps:[]};

    

    if (data.eventWorkflowOID) {
      workflow['workflowOID'] = data.eventWorkflowOID.toString();
      
    }

    workflow['triggeringEventOID'] = data.triggeringEvent.eventTypeOID.toString();
    //console.log("triggeringEventOID" + data.triggeringEvent.eventTypeOID.toString());

    if (data.description) {
        workflow['description'] = data.description;
    }

    if (data.workflowSteps.length > 0) {
        data.workflowSteps.forEach(item => {
        const step = {};
        
<<<<<<< HEAD
        //RS: WorkflowStepOID needs to be initialized in the object class else the 
=======
<<<<<<< HEAD
        //RS: WorkflowStepOID needs to be initialized in the object class else the 
=======
<<<<<<< HEAD
        //RS: WorkflowStepOID needs to be initialized in the object class else the 
=======
        //WorkflowStepOID needs to be initialized in the object class else the 
>>>>>>> 0676f8670d15028f8eea36eae7232fdb0e5073fe
>>>>>>> 3ac78d054b0dc91eab3a43f0bc25529f55defe65
>>>>>>> b0b2a81ab178f7a61be32a787ed43fbc3728f5e3
        //delayDays and Task Object would not be passed to the server

        if (item.workflowStepOID != null) {
          step['workflowStepOID'] = item.workflowStepOID.toString();
          step['delayDays'] = item.delayDays.toString();
          step['taskTypeOID'] = item.taskType.taskTypeOID.toString();
        }

        // if (party.ref.poolOID)
        //    step.assignedPoolOID = party.ref.poolOID;
        // if (party.ref.partyOID)
        //     step.assignedPartyOID = party.ref.partyOID;

        if (item.assignedParty) {
          step['assignedPartyOID'] = item.assignedParty.partyOID.toString();
        }
        if (item.assignedPool) {
          step['assignedPoolOID'] = item.assignedPool.poolOID.toString();
        }
        if (item.documentTemplateOID) {
          step['documentTemplateOID'] = item.documentTemplateOID.toString();
        }
        workflow.workflowSteps.push(step);
      });
    }

    console.log(workflow);
    
    const url = `${this.getBaseUrl()}/SaveEventWorkflow`;

    return this.http
      .post(url, workflow, { responseType: 'text' })
      .map(result => {
        if (result) {
          const eventWorkflows: EventWorkflow[] = JSON.parse(result);
          return eventWorkflows[0];
        }
        return data;
      });
  }

  saveTaskType(data: TaskType): Observable<TaskType> {
    const url = this.getBaseUrl() + '/SaveTaskType';
    const obj = {
      taskTypeOID: data.taskTypeOID ? data.taskTypeOID.toString() : null,
      name: data.name,
      description: data.description,
    };

    return this.http.post<TaskType>(
      url,
      obj
    );
  }


  /**
   * @name SaveStaffPool
   * @param data
     statusOID:"2"
     name:"JSO-Unit9"
   */
  saveStaffPool(data: StaffPool): Observable<StaffPool> {
    const url: string = this.getBaseUrl() + '/SaveStaffPool';
    const obj = {
      poolOID: data.poolOID ? data.poolOID.toString() : null,
      name: data.poolName,
    };

    return this.http.post<StaffPool>(
      url,
      obj
    );
  }

  /**
   * @name SavePersonIdType
   * @param data
     personTypeOID:"2"
     name:"National ID"
     description: "Trinidad and Tobago National ID Card"
   */
  savePersonIdType(data: PersonIdType): Observable<PersonIdType> {
    const url: string = this.getBaseUrl() + '/SavePersonIdentificationType';
    const obj = {
      personIdentificationTypeOID: data.personIdentificationTypeOID ? data.personIdentificationTypeOID.toString() : null,
      name: data.name,
      description: data.description
    };

    return this.http.post<PersonIdType>(
      url,
      obj
    );
  }

  // TODO: Get API signature from Aaron
  deleteLookupItem(type: string, id: string | number) {
    const url: string = this.getBaseUrl() + '/Delete/' + type;

    return this.http.post(
      url,
      id.toString()
    );
  }



  public getMock(fileName) {
    const url: string = this.getBaseMockUrl() + fileName;

    return this.http.get(url);
  }




}
