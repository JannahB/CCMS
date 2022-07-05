import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { CalFacilitiesComponent } from './calendar/cal-facilities/cal-facilities.component';
import { CalResourcesComponent } from './calendar/cal-resources/cal-resources.component';
import { CalTemplatesComponent } from './calendar/cal-templates/cal-templates.component';
import { HolidaysComponent } from './calendar/holidays/holidays.component';
import { ICCSCodesComponent } from './data/iccs-codes/iccs-codes.component';
import { CaseStatusesComponent } from './data/case-statuses/case-statuses.component';
import { CasePhasesComponent } from './data/case-phases/case-phases.component';
import { CaseTypesComponent } from './data/case-types/case-types.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataComponent } from './data/data.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminStaffPoolComponent } from './admin-staffpools/admin-staffpools.component';
import { AdminComponent } from './admin.component';
import { AdminWorkflowComponent } from './admin-workflow/admin-workflow.component';
import { CanActivateAuthenticationGuard } from '../common/guards/can-activate-authentication.guard';
import { CanActivateIsCourtUserGuard } from '../common/guards/can-activate-is-court-user.guard';
import { CourtLocationsComponent } from './data/court-locations/court-locations.component';
import { CasePartyRolesComponent } from './data/case-party-roles/case-party-roles.component';
import { EventTypesComponent } from './data/event-types/event-types.component';
import { HearingTypeComponent } from './data/hearing-type/hearing-type.component';
import { StaffRoleComponent } from './data/staff-role/staff-role.component';
import { CourtComponent } from './data/court/court.component';
import { CanActivateIsCourtMgrGuard } from '../common/guards/can-activate-is-court-mgr.guard';
import { AssignmentManagerComponent } from './assignment-manager/assignment-manager.component';
import { RolePermissions } from './data/role-permissions/role-permissions.component';
import { StaffPoolComponent } from './data/staff-pool/staff-pool.component';
import { TaskTypesComponent } from './data/task-types/task-types.component';
import { PersonIdTypesComponent } from './data/person-id-types/person-id-types.component';
// import { IccsCodesLocalChargesComponent } from './data/iccs-codes-local-charges/iccs-codes-local-charges.component';

const routes: Routes = [
  {
    path: 'admin', component: AdminComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'data/users' },

      //  {path: 'data/:tableId', component: DataComponent, canActivate: [CanActivateAuthenticationGuard]},

      {
        path: 'data', component: DataComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'casetypes' },
          { path: 'casetypes', component: CaseTypesComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          { path: 'casephases', component: CasePhasesComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          { path: 'casestatuses', component: CaseStatusesComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          { path: 'courtlocations', component: CourtLocationsComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          { path: 'casepartyroles', component: CasePartyRolesComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          { path: 'eventtypes', component: EventTypesComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          { path: 'hearingtypes', component: HearingTypeComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          { path: 'staffroles', component: StaffRoleComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          { path: 'courts', component: CourtComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          { path: 'rolepermissions', component: RolePermissions, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          {
            path: 'iccscodes', component: ICCSCodesComponent,
            canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard]
          },
          // { path: 'iccscodeslocalcharges', component: IccsCodesLocalChargesComponent,
          //         canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
          {
            path: 'staffpools', component: StaffPoolComponent,
            canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard]
          },
          {
            path: 'tasktypes', component: TaskTypesComponent,
            canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard]
          },
          {
            path: 'personalidtypes', component: PersonIdTypesComponent,
            canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard]
          }
        ]
      },

      { path: 'users', component: AdminUsersComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
      { path: 'staffpools', component: AdminStaffPoolComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
      { path: 'workflow', component: AdminWorkflowComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard] },
      {
        path: 'calendar',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'holidays' },
          { path: 'holidays', component: HolidaysComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtMgrGuard] },
          {
            path: 'templates', component: CalTemplatesComponent,
            canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtMgrGuard]
          },
          {
            path: 'resources', component: CalResourcesComponent,
            canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtMgrGuard]
          },
          {
            path: 'facilities', component: CalFacilitiesComponent,
            canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtMgrGuard]
          }

        ]
      },
      {
        path: 'assignment-mgr', component: AssignmentManagerComponent,
        canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtMgrGuard]
      },
      {
        path: 'pdf-viewer', component: PdfViewerComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtMgrGuard]
      }


    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
