import { Address } from './Address';
import { AuthorizedCourt } from './AuthorizedCourt';
import { Email } from './Email';
import { Identifier } from './Identifier';
import { Language } from './Language';
import { LookupEntity } from './base/lookup-entity';
import { PhoneNumber } from './PhoneNumber';
import { Role } from './Role';
import { Occupation } from './Occupation';

export class Party extends LookupEntity {

  id: number = 0;
  partyOID: number = 0;
  courtOID: number = 0;
  lastName: string = "";
  firstName: string = "";
  displayName: string = "";
  sex: string = "";
  maritalStatus: string = "";
  password: string = "";
  dob: any = null;
  isCourtUser: boolean = false;
  anonymizationFlag: boolean = false;
  role: Role = new Role();
  notes: string = "";
  addresses: Address[] = [];
  emails: Email[] = [];
  phoneNumbers: PhoneNumber[] = [];
  identifiers: Identifier[] = [];
  occupations: Occupation[] = [];
  interpreterRequiredIndicator: boolean = false;
  signLanguageInterpreterRequiredIndicator: boolean = false;
  visuallyImpairedIndicator: boolean = false;
  countryOfBirth : string = "";
  countryOfResidence : string = "";
  spokenLanguages: Language[] = [];
  alternativeName: string = "";
  //alternativeName2: string = "";
  //alternativeName3: string = "";
  authorizedCourts: AuthorizedCourt[] = [];
  queryName: string = "";
  age: number = 0;
  isOrganization: boolean = false;
  fullName: string = "";
  primaryAddressLoc: number = 0;
  primaryContactLoc: number = 0;
  policeRegimentalNumber: string = ""; //Used to send PRG to BE if creating a Police Officer via the Add Case Party Modal.

  public static createDisplayName(party: Party): string {

    // Use full name as the preferred name form
    if (typeof party.fullName === 'string'
      && party.fullName.trim().length !== 0
      && party.fullName.trim() !== "null") {
      return party.fullName;
    }

    // ------- Set display name as concantenation of first and last names ------- //
    let displayName = "";
    if (typeof party.firstName === 'string') {
      displayName += party.firstName;
    }

    if (typeof party.lastName === 'string') {
      displayName += " " + party.lastName;
    }

    return displayName.trim();

  }

}

