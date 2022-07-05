import { LookupEntity } from './base/lookup-entity';
import { Permission } from './Permission';

export class Role extends LookupEntity {
  casePartyRoleOID: number;
  staffRoleOID: number;
  courtOID: number;
  staffRoleName: string;
  judicialOfficer: boolean;
  ccmsAdmin: boolean;
  permissions: Permission[];
}
