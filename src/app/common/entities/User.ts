import { Language } from './Language';
import { Identifier } from './Identifier';
import { StaffRole } from './StaffRole';
import { Address } from './Address';
import { Email } from './Email';
import { PhoneNumber } from './PhoneNumber';
import { AuthorizedCourt } from './AuthorizedCourt';

export class User {

  userName: string = "";
  partyOID: number = 0;
  courtOID: number = 0;
  firstName: string = "";
  lastName: string = "";
  password: string = "";
  isCourtUser: boolean = true;
  anonymizationFlag: boolean = false;
  roles: StaffRole[] = [];
  notes: string = "";
  addresses: Address[] = [];
  emails: Email[] = [];
  phoneNumbers: PhoneNumber[] = [];
  identifiers: Identifier[] = [];
  interpreterRequiredIndicator: boolean = false;
  spokenLanguages: Language[] = [];
  alternativeName: string = "";
  authorizedCourts: AuthorizedCourt[] = [];
  queryName: string = "";

}