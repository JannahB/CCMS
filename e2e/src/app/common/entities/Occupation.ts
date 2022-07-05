import { LookupEntity } from './base/lookup-entity';

export class Occupation extends LookupEntity {

  partyOccupationOID: number = 0;
  partyOID: number = 0;
  jobTitle: string = ""; //equivalent of identifier type
  identifierValue: string = "";
  notes: string = "";
  description: string = "";
}
