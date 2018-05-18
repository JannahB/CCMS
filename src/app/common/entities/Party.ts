import { Address } from './Address';
import { AuthorizedCourt } from './AuthorizedCourt';
import { Email } from './Email';
import { Identifier } from './Identifier';
import { Language } from './Language';
import { LookupEntity } from './base/lookup-entity';
import { PhoneNumber } from './PhoneNumber';
import { Role } from './Role';

export class Party extends LookupEntity {

  id: number = 0;
  partyOID: number = 0;
  courtOID: number = 0;
  lastName: string = "";
  firstName: string = "";
  sex: string = "";
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
  interpreterRequiredIndicator: boolean = false;
  spokenLanguages: Language[] = [];
  alternativeName: string = "";
  authorizedCourts: AuthorizedCourt[] = [];
  queryName: string = "";

  age: number = 0;
}
