import { LookupEntity } from './base/lookup-entity';

export class Email extends LookupEntity {

  partyEmailOID: number = 0;
  partyOID: number = 0;
  emailAddressType:string = "";
  emailAddress:string = "";
}
