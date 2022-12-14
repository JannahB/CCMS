import { CaseCountsComponent } from './reports/case-counts/case-counts.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CaseSearchComponent } from './case/case-search/case-search.component';
import { CaseDetailComponent } from './case/case-detail/case-detail.component';

import { PartyDetailComponent } from './party/party-detail/party-detail.component';
import { PartySearchComponent } from './party/party-search/party-search.component';
import { LoginComponent } from './login/login.component';
import { CanActivateAuthenticationGuard } from './common/guards/can-activate-authentication.guard';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { NewPasswordComponent } from './login/new-password/new-password.component';
import { JemsDashboardComponent } from './jems/jems-dashboard/jems-dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [CanActivateAuthenticationGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'new-password/:token', component: NewPasswordComponent },
  { path: 'party-detail/:partyId', component: PartyDetailComponent, canActivate: [CanActivateAuthenticationGuard] },
  { path: 'party-search', component: PartySearchComponent, canActivate: [CanActivateAuthenticationGuard] },
  { path: 'case-detail/:caseId', component: CaseDetailComponent, canActivate: [CanActivateAuthenticationGuard] },
  { path: 'case-search', component: CaseSearchComponent, canActivate: [CanActivateAuthenticationGuard] },
  { path: 'reports/case-count', component: CaseCountsComponent, canActivate: [CanActivateAuthenticationGuard] },
  { path: 'jems', component: JemsDashboardComponent, canActivate: [CanActivateAuthenticationGuard] },

  // { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'},

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
