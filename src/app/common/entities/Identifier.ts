import { LookupEntity } from './base/lookup-entity';

export class Identifier extends LookupEntity {

  partyIdentifierOID: number;
  partyOID: number;
  identifierType: string;
  identifierValue: string;
  notes:string;
}
