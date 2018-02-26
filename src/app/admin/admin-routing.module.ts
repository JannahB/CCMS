import { IccsCodesComponent } from './data/iccs-codes/iccs-codes.component';
import { CaseStatusesComponent } from './data/case-statuses/case-statuses.component';
import { CasePhasesComponent } from './data/case-phases/case-phases.component';
import { CaseTypesComponent } from './data/case-types/case-types.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDataComponent } from './admin-data/admin-data.component';
import { DataComponent } from './data/data.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminComponent } from './admin.component';
import { AdminWorkflowComponent } from './admin-workflow/admin-workflow.component';
import { CanActivateAuthenticationGuard } from '../common/guards/can-activate-authentication.guard';
import { CanActivateIsCourtUserGuard } from './../common/guards/can-activate-is-court-user.guard';
import { CourtLocationsComponent } from './data/court-locations/court-locations.component';
import { CasePartyRolesComponent } from './data/case-party-roles/case-party-roles.component';
import { EventTypesComponent } from './data/event-types/event-types.component';
import { HearingTypeComponent } from './data/hearing-type/hearing-type.component';

const routes: Routes = [
  {path: 'admin', component: AdminComponent,
    children: [
       {path: '', pathMatch: 'full', redirectTo: 'data/users' },

      //  {path: 'data/:tableId', component: DataComponent, canActivate: [CanActivateAuthenticationGuard]},

       {path: 'data', component: DataComponent,
         children: [
          {path: '', pathMatch: 'full', redirectTo: 'casetypes' },
          {path: 'casetypes', component: CaseTypesComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard ]},
          {path: 'casephases', component: CasePhasesComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard ]},
          {path: 'casestatuses', component: CaseStatusesComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard ]},
          {path: 'courtlocations', component: CourtLocationsComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard ]},
          {path: 'casepartyroles', component: CasePartyRolesComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard ]},
          {path: 'eventtypes', component: EventTypesComponent , canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard ]},
          {path: 'hearingtypes', component: HearingTypeComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard ] },
          {path: 'iccscodes', component: IccsCodesComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard ] },


         ]
       },

       {path: 'users', component: AdminUsersComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard ]},
       {path: 'workflow', component: AdminWorkflowComponent, canActivate: [CanActivateAuthenticationGuard, CanActivateIsCourtUserGuard ]},
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
