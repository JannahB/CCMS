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

const routes: Routes = [
  {path: 'admin', component: AdminComponent,
    children: [
       {path: '', pathMatch: 'full', redirectTo: 'data/users' },

      //  {path: 'data/:tableId', component: DataComponent, canActivate: [CanActivateAuthenticationGuard]},

       {path: 'data', component: DataComponent,
         children: [
          {path: '', pathMatch: 'full', redirectTo: 'casetypes' },
          {path: 'casetypes', component: CaseTypesComponent},
          {path: 'casephases', component: CasePhasesComponent},
          {path: 'casestatuses', component: CaseStatusesComponent},
         ]
       },

       {path: 'users', component: AdminUsersComponent},
       {path: 'workflow', component: AdminWorkflowComponent},
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
