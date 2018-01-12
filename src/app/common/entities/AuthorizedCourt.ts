import { Role } from './Role';
import { LookupEntity } from './base/lookup-entity';

export class AuthorizedCourt extends LookupEntity {

  courtOID: number; 
  locationCode: string; 
  courtName: string;
  casePhases: any[];
  caseStatuses: any[];
  caseTypes: any[];
  casePartyRoles: any[];
  hearingTypes: any[];
  caseTaskTypes: any[];
  iccsCodes: any[];
  eventTypes: any[];
  chargeFactors: any[];
  courtLocations: any[];
  staffRoles: any[];
  personIDTypes: any[];
  roles: Role[]; 
}
