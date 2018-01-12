import { Address } from './Address';
import { AuthorizedCourt } from './AuthorizedCourt';
import { Email } from './Email';
import { Identifier } from './Identifier';
import { Language } from './Language';
import { LookupEntity } from './base/lookup-entity';
import { PhoneNumber } from './PhoneNumber';
import { Role } from './Role';

export class Party extends LookupEntity {

  partyOID: number; 
  courtOID: number; 
  lastName: string; 
  firstName: string; 
  sex: string; 
  password: string; 
  dob: Date; 
  isCourtUser: boolean; 
  anonymizationFlag: boolean; 
  roles: Role[];
  notes: string; 
  addresses: Address[];
  emails: Email[]; 
  phoneNumbers: PhoneNumber[]; 
  identifiers: Identifier[];
  interpreterRequiredIndicator: boolean; 
  spokenLanguages: Language[];
  alternativeName: string; 
  authorizedCourts: AuthorizedCourt[]; 
  queryName: string; 
}
