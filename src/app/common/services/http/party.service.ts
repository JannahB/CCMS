import { Pool } from './../../entities/Pool';
import { PhoneNumber } from './../../entities/PhoneNumber';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DateConverter } from './../../utils/date-converter';
import { HttpBaseService } from '../http/http-base.service';
import { Party } from './../../entities/Party';
import { Identifier } from '../../entities/Identifier';
import { Address } from './../../entities/Address';
import { Email } from '../../entities/Email';
import { DatePipe } from '@angular/common';


@Injectable()
export class PartyService extends HttpBaseService<Party> {

  private mockFile: string = 'parties.json';
  private datePipe: DatePipe = new DatePipe("en");

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/FetchParty`;
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

  // public fetch(partyName:string):Observable<Party[]>{
  //   let url: string = `${super.getBaseUrl()}/FetchParty`;

  //   return this.http.post<Party[]>(url,
  //     {
  //       partyName: partyName
  //     },
  //     {
  //       headers: {
  //         uiVersion: "2"
  //       }
  //     })
  //     .map(res => {
  //       let parties:Party[] = res;
  //       return this.convertDates(parties);
  //     })
  // }


  public getAllSlim(): Observable<Party[]> {
    let url: string = `${super.getBaseUrl()}/api/parties`;
    return this.http.get<Party[]>(url)
      .map(res => {
        let parties: Party[] = res;
        return parties;
      });
  }

  public getAllStaffPoolSlim(): Observable<Pool[]> {
    let url: string = `${super.getBaseUrl()}/api/staff-pools`;
    return this.http.get<Pool[]>(url)
      .map(res => {
        let staffPools: Pool[] = res;
        return staffPools;
      });
  }

  public fetchAny(obj: any): Observable<Party[]> {
    let url: string = `${super.getBaseUrl()}/FetchParty`;

    return this.http.post<Party[]>(url, obj,
      {
        headers: { uiVersion: "2" }
      })
      .map(res => {
        let parties: Party[] = res;
        return this.convertDates(parties);
      })
  }

  public fetchOne(id: string): Observable<Party> {
    let url: string = `${super.getBaseUrl()}/FetchParty`;

    return this.http.post<Party>(url,
      { partyOID: id },
      {
        headers: { uiVersion: "2" }
      })
      .map(res => {
        let party: Party = res[0];
        party = this.convertDates([party])[0];
        return party;
      })
  }

  public saveParty(data: Party): Observable<Party> {
    //Generic object because some properties will be converted to string or number
    //for save
    let party: any = {
      firstName: '',
      lastName: '',
      alertnativeName: '',
      alertnativeName2: '',
      alertnativeName3: '',
      sex: '',
      dob: '',
      notes: ''
    };
    if (data.partyOID) {
      party.partyOID = data.partyOID ? data.partyOID.toString() : "0";
      // only update court user on update
      party.isCourtUser = (data.isCourtUser ? "1" : "0");
    }

    party.interpreterRequiredIndicator = (data.interpreterRequiredIndicator ? "1" : "0");
    party.spokenLanguages = data.spokenLanguages.map(language => language.languageName);
    party.firstName = data.firstName;
    party.lastName = data.lastName;
    party.fullName = data.fullName;
    party.alternativeName = data.alternativeName;
    party.alternativeName2 = data.alternativeName2;
    party.alternativeName3 = data.alternativeName3;
    party.sex = data.sex;
    party.dob = this.datePipe.transform(data.dob, "yyyy-MM-dd");
    party.isOrganization = (data.isOrganization ? "1" : "0");
    if (data.identifiers) {
      party.identifiers = [];
      data.identifiers.forEach(identifier => {
        let value: any = {};
        Object.assign(value, identifier);

        if (value.startDate)
          value.startDate = this.datePipe.transform(value.startDate, "yyyy-MM-dd");
        if (value.endDate)
          value.endDate = this.datePipe.transform(value.endDate, "yyyy-MM-dd");
        else
          value.endDate = '';

        value.partyIdentifierOID = value.partyIdentifierOID ? value.partyIdentifierOID.toString() : "0";
        value.partyOID = value.partyOID ? value.partyOID.toString() : "0";

        party.identifiers.push(value);
      });
    }

    if (data.addresses) {
      party.addresses = [];
      data.addresses.forEach(address => {
        let value: any = {};
        Object.assign(value, address);
        if (value.startDate)
          value.startDate = this.datePipe.transform(value.startDate, "yyyy-MM-dd");
        if (value.endDate)
          value.endDate = this.datePipe.transform(value.endDate, "yyyy-MM-dd");
        else
          value.endDate = '';

        value.addressOID = value.addressOID ? value.addressOID.toString() : "0";
        value.partyOID = value.partyOID ? value.partyOID.toString() : "0";

        party.addresses.push(value);
      });
    }

    if (data.phoneNumbers) {
      party.phoneNumbers = [];
      data.phoneNumbers.forEach(phoneNumber => {
        let value: any = {};
        Object.assign(value, phoneNumber);
        value.textMessagesIndicator = (value.textMessagesIndicator ? "1" : "0");
        if (value.startDate)
          value.startDate = this.datePipe.transform(value.startDate, "yyyy-MM-dd");
        if (value.endDate)
          value.endDate = this.datePipe.transform(value.endDate, "yyyy-MM-dd");
        else
          value.endDate = '';

        value.partyPhoneOID = value.partyPhoneOID ? value.partyPhoneOID.toString() : "0";
        value.partyOID = value.partyOID ? value.partyOID.toString() : "0";

        party.phoneNumbers.push(value);
      });
    }
    if (data.emails) {
      party.emails = [];
      data.emails.forEach(email => {
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

        party.emails.push(value);
      });
    }
    if (data.notes)
      party.notes = data.notes;

    let url: string = `${super.getBaseUrl()}/SaveParty`;
    return this.http
      .post<Party[]>(url, party)
      .map(parties => this.convertDates(parties)[0]);
  }

  public getMock(): Observable<Party[]> {
    let url: string = this.getBaseMockUrl();
    return this.http.get<Party[]>(url)
      .map(res => {
        let parties: Party[] = res;
        // parties.forEach( p => {
        //   p.dob = DateConverter.convertDate(p.dob);
        // })
        return this.convertDates(parties);
      });
  }

  public getOneMock(partyId: string): Observable<Party> {
    let url: string = this.getBaseMockUrl();
    return this.http.get<Party[]>(url)
      .map(res => {
        let parties: Party[] = res;
        parties = this.convertDates(parties);
        let party: Party = parties[0];
        return party;
      });
  }

  private convertDates(parties: Party[]) {
    if (!parties) return;

    parties.forEach(p => {
      p.dob = DateConverter.convertDate(p.dob);

      let idents: Identifier[] = p.identifiers;
      if (idents) {
        idents.forEach(idf => {
          idf.startDate = DateConverter.convertDate(idf.startDate);
          idf.endDate = DateConverter.convertDate(idf.endDate);
        })
      }
      let addresses: Address[] = p.addresses;
      if (addresses) {
        addresses.forEach(addr => {
          addr.startDate = DateConverter.convertDate(addr.startDate);
          addr.endDate = DateConverter.convertDate(addr.endDate);
        })
      }
      let emails: Email[] = p.emails;
      if (emails) {
        emails.forEach(em => {
          em.startDate = DateConverter.convertDate(em.startDate);
          em.endDate = DateConverter.convertDate(em.endDate);
        })
      }
      let phones: PhoneNumber[] = p.phoneNumbers;
      if (phones) {
        phones.forEach(ph => {
          ph.startDate = DateConverter.convertDate(ph.startDate);
          ph.endDate = DateConverter.convertDate(ph.endDate);
        })
      }

    })
    return parties;
  }

}
