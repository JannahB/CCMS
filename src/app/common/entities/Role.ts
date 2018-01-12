import { LookupEntity } from './base/lookup-entity';

export class Role extends LookupEntity {

  staffRoleOID: number; 
  courtOID: number; 
  staffRoleName: string; 
  judicialOfficer: boolean; 
  ccmsAdmin: boolean; 
}
