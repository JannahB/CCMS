import { LookupEntity } from './base/lookup-entity';

export class Email extends LookupEntity {

  partyEmailOID: number;
  partyOID: number; 
  emailAddressType:string; 
  emailAddress:string; 
}
