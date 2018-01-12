import { LookupEntity } from './base/lookup-entity';

export class Address extends LookupEntity {

  addressOID: number;
  partyOID: number;
  addressType: string;
  address1:string;
  address2:string;
  address3:string;
  communityCode:string;
  administrativeArea:string;
  municipalityName:string;
  postalCode:string;
  countryName:string; 
  addressDescriptionText:string;
}
