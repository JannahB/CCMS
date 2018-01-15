import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CaseSearchComponent } from './case/case-search/case-search.component';
import { CaseDetailComponent } from './case/case-detail/case-detail.component';

// import {DashboardDemoComponent} from './demo/view/dashboarddemo.component';
// import {SampleDemoComponent} from './demo/view/sampledemo.component';
// import {FormsDemoComponent} from './demo/view/formsdemo.component';
// import {DataDemoComponent} from './demo/view/datademo.component';
// import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
// import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
// import {MenusDemoComponent} from './demo/view/menusdemo.component';
// import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
// import {MiscDemoComponent} from './demo/view/miscdemo.component';
// import {EmptyDemoComponent} from './demo/view/emptydemo.component';
// import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
// import {FileDemoComponent} from './demo/view/filedemo.component';
// import {UtilsDemoComponent} from './demo/view/utilsdemo.component';
// import {DocumentationComponent} from './demo/view/documentation.component';

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
    {path: 'party-detail', component: PartyDetailComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'party-search', component: PartySearchComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'case', component: CaseDetailComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'case-search', component: CaseSearchComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'admin-data', component: AdminDataComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'admin-workflow', component: AdminWorkflowComponent, canActivate: [CanActivateAuthenticationGuard]},
    {path: 'admin-users', component: AdminUsersComponent, canActivate: [CanActivateAuthenticationGuard]},
    
    // {path: 'demo', component: DashboardDemoComponent},
    // {path: 'sample', component: SampleDemoComponent},
    // {path: 'forms', component: FormsDemoComponent},
    // {path: 'data', component: DataDemoComponent},
    // {path: 'panels', component: PanelsDemoComponent},
    // {path: 'overlays', component: OverlaysDemoComponent},
    // {path: 'menus', component: MenusDemoComponent},
    // {path: 'messages', component: MessagesDemoComponent},
    // {path: 'misc', component: MiscDemoComponent},
    // {path: 'empty', component: EmptyDemoComponent},
    // {path: 'charts', component: ChartsDemoComponent},
    // {path: 'file', component: FileDemoComponent},
    // {path: 'utils', component: UtilsDemoComponent},
    // {path: 'documentation', component: DocumentationComponent}
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
