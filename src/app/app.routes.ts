import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CaseSearchComponent } from './case/case-search/case-search.component';
import { CaseDetailComponent } from './case/case-detail/case-detail.component';

import { PartyDetailComponent } from './party/party-detail/party-detail.component';
import { PartySearchComponent } from './party/party-search/party-search.component';
import { AdminDataComponent } from './admin/admin-data/admin-data.component';
import { AdminWorkflowComponent } from './admin/admin-workflow/admin-workflow.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { LoginComponent } from './login/login.component';
import { CanActivateAuthenticationGuard } from './common/guards/can-activate-authentication.guard';

export const routes: Routes = [
    {path: '', component: DashboardComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'login', component: LoginComponent },
    {path: 'party-detail/:partyId', component: PartyDetailComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'party-search', component: PartySearchComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'case-detail/:caseId', component: CaseDetailComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'case-search', component: CaseSearchComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'admin-data', component: AdminDataComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'admin-workflow', component: AdminWorkflowComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'admin-users', component: AdminUsersComponent, canActivate: [CanActivateAuthenticationGuard]},

    // {path: '', component: DashboardComponent},
    // {path: 'login', component: LoginComponent },
    // {path: 'party-detail/:partyId', component: PartyDetailComponent},
    // {path: 'party-search', component: PartySearchComponent},
    // {path: 'case-detail/:caseId', component: CaseDetailComponent},
    // {path: 'case-search', component: CaseSearchComponent},
    // {path: 'admin-data', component: AdminDataComponent},
    // {path: 'admin-workflow', component: AdminWorkflowComponent},
    // {path: 'admin-users', component: AdminUsersComponent},


];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
