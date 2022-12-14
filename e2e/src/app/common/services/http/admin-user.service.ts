import { Inject, Injectable, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

import { UserDTO } from '../../entities/UserDTO';
import { User } from '../../entities/User';
import { Court } from '../../entities/Court';
import { AuthorizedCourt } from '../../entities/AuthorizedCourt';


@Injectable()
export class AdminUserService {

  public static authenticationToken: string = null;
  private datePipe: DatePipe = new DatePipe("en");

  protected getBaseUrl(): string {
    return `${environment.apiUrl}`;
  }

  protected getBaseMockUrl(): string {
    return `${environment.mockUrl}`;
  }

  constructor(@Inject(forwardRef(() => HttpClient)) protected http: HttpClient) { }


  fetchLookup<T>(endpoint: string): Observable<T[]> {
    let url: string = this.getBaseUrl() + '/' + endpoint;

    return this.http.get<T[]>(url);
  }


  /**
   *
   * @name saveUser
   * @param data
   *   {
   *     "partyOID":"0",
   *     "firstName":"Carol",
   *     "lastName":"Herbert",
   *     "password":"cherbert",
   *     "userName":"cherbert",
   *     "authorizedCourts":[
   *       {
   *         "courtOID":"5",
   *         "roles":[
   *           {
   *             "staffRoleOID":"1"}
   *         ]
   *       }
   *     ]
   *   }
   */
  saveUser(data: User): Observable<User> {

    let url: string = this.getBaseUrl() + '/SaveStaffParty';

    let userDTO: UserDTO = new UserDTO();
    userDTO.partyOID = data.partyOID ? data.partyOID.toString() : "0";
    userDTO.firstName = data.firstName;
    userDTO.lastName = data.lastName;
    userDTO.userName = data.userName;
    userDTO.password = data.password;
    userDTO.emails = data.emails.length ? this.serializeEmails(data.emails) : []; // .push( {emailAddress: data.emails[0]}) //  data.emails[0].emailAddress; // activate this when Aaron adds prop to DB
    userDTO.authorizedCourts = this.convertCourts(data.authorizedCourts);

    return this.http.post<User>(
      url,
      userDTO,
      { headers: { uiVersion: "2" } }
    )
  }

  private serializeEmails(emails: any[]): any[] {
    let newEmails = [];
    emails.forEach(email => {
      let value: any = {};
      Object.assign(value, email);
      if (value.startDate)
        value.startDate = this.datePipe.transform(value.startDate, "yyyy-MM-dd");
      if (value.endDate)
        value.endDate = this.datePipe.transform(value.endDate, "yyyy-MM-dd");
      else
        value.endDate = '';

      value.partyEmailOID = value.partyEmailOID ? value.partyEmailOID.toString() : "0";
      value.partyOID = value.partyOID ? value.partyOID.toString() : "0";

      newEmails.push(value);

    });
    return newEmails;
  }

  private convertCourts(courts: AuthorizedCourt[]): any[] {
    // return obj looks like:  [{ "courtOID":"5", "roles":[ {"staffRoleOID":"1"}] }]
    let authCourts = [];
    authCourts = courts.map(c => {
      return {
        courtOID: c.courtOID.toString(),
        roles: c.roles.map(r => {
          return { staffRoleOID: r.staffRoleOID.toString() }
        })
      }
    })
    return authCourts;
  }

  // let bArr = [];
  // bArr = aArr.map(p => {
  //   return { pts : p.points.toString(),
  //          roles: p.roles.map(r => {
  //            return { rls: r.role.toString()}
  //          })}
  // })

  /**
   *
   * @name saveCasePhase
   * @param data
    // casePhaseOID:"2"
    // caseTypeOID:"1"
    // description:null
    // name:"Hearing & Management Type"
   */

  /*
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
 */

  public getMock(fileName) {
    let url: string = this.getBaseMockUrl() + fileName;

    return this.http.get(url)
  }




}
