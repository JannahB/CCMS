import { Permission } from './Permission';
import { RolePermissionCheckable } from './RolePermissionCheckable';

export class StaffRolePermission {
  courtOID: number = 0;
  ccmsAdmin: boolean = false;
  judicialOfficer: boolean = false;
  staffRoleName: string = "";
  staffRoleOID: number = 0;
  permissions:Permission[]=null;
  permissionsState:RolePermissionCheckable[]=null; // new
}
