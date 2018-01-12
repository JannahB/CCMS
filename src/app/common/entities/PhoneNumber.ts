import { LookupEntity } from './base/lookup-entity';

export class PhoneNumber extends LookupEntity {

  partyPhoneOID: number; 
  partyOID: number; 
  phoneType: string; 
  phoneNumber: string; 
  textMessagesIndicator: boolean; 
}
