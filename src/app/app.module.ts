import { AppStateService } from './common/services/state/app.state.sevice';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, EmailValidator } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { AppRoutes } from './app.routes';
import 'rxjs/add/operator/toPromise';

import { AccordionModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { BreadcrumbModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ChipsModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/primeng';
import { SharedModule } from 'primeng/primeng';
import { ContextMenuModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
import { DataScrollerModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DragDropModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { LightboxModule } from 'primeng/primeng';
import { ListboxModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { MenubarModule } from 'primeng/primeng';
import { MessageModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { OrderListModule } from 'primeng/primeng';
import { OrganizationChartModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { ProgressBarModule } from 'primeng/primeng';
import { ProgressSpinnerModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { RatingModule } from 'primeng/primeng';
import { ScheduleModule } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
import { SlideMenuModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import { SpinnerModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { TieredMenuModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { TreeModule } from 'primeng/primeng';
import { TreeTableModule } from 'primeng/primeng';
import { CustomMaterialModule } from './common/modules/customMaterial.module';


import { AppComponent } from './app.component';
import { AppMenuComponent, AppSubMenuComponent } from './app.menu.component';
import { AppTopbarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';
import { AppRightpanelComponent } from './app.rightpanel.component';
import { AppInlineProfileComponent } from './app.profile.component';

import { GlobalState } from './common/services/state/global.state'
import { BreadcrumbService } from './breadcrumb.service';
import { DateParserService } from './common/services/utility/dates/date-parser.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IdentifierService } from './common/services/http/identifier.service';
import { CaseSearchComponent } from './case/case-search/case-search.component';
import { CaseDetailComponent } from './case/case-detail/case-detail.component';
import { PartyDetailComponent } from './party/party-detail/party-detail.component';
import { PartySearchComponent } from './party/party-search/party-search.component';
import { CaseService } from './common/services/http/case.service';
import { AdminWorkflowComponent } from './admin/admin-workflow/admin-workflow.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { LookupService } from './common/services/http/lookup.service';
import { CountriesService } from './common/services/http/countries.service';
import { GenericTypesService } from './common/services/http/generic.types.service';
import { PartyService } from './common/services/http/party.service';
import { LanguageService } from './common/services/http/language.service';
import { DropdownDataTransformService } from './common/services/utility/dropdown-data-transform.service';
import { DateValidatorService } from './common/services/utility/dates/date-validator.service';
import { ToastService } from './common/services/utility/toast.service';
import { AuthorizationInterceptor } from './common/interceptors/authorization.interceptor';
import { LoginComponent } from './login/login.component';
import { CanActivateAuthenticationGuard } from './common/guards/can-activate-authentication.guard';
import { CanActivateIsCourtUserGuard } from './common/guards/can-activate-is-court-user.guard';
import { AuthenticationService } from './common/services/http/authentication.service';
import { LoadingBarComponent } from './common/components/loading-bar.component';
import { LocalStorageService } from './common/services/utility/local-storage.service';
import { GlobalErrorHandlerService } from './common/services/utility/global-error-handler.service';
import { AuthenticationModel } from './common/model/authentication-model';
import { UserService } from './common/services/utility/user.service';
import { DropdownPipe } from './common/pipes/dropdown.pipe';
import { AdminDataService } from './common/services/http/admin-data.service';
import { AdminUserService } from './common/services/http/admin-user.service';
import { CourtService } from './common/services/http/court.service';
import { AdminModule } from './admin/admin.module';
import { CustomAutocompleteComponent } from './common/components/custom-autocomplete/custom-autocomplete.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { NewPasswordComponent } from './login/new-password/new-password.component';
import { ReferenceDataIdToNamePipe } from './common/pipes/reference-data-id-to-name.pipe';
import { NamePipe } from './common/pipes/name.pipe';
import { CalendarService } from './common/services/http/calendar.service';
import { CalFacilityService } from './common/services/http/calFacility.service';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutes,
    HttpModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    ChipsModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    HttpClientModule,
    CustomMaterialModule,
    AdminModule
  ],
  declarations: [
    AppComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    AppTopbarComponent,
    AppFooterComponent,
    AppBreadcrumbComponent,
    AppRightpanelComponent,
    AppInlineProfileComponent,
    DashboardComponent,
    CaseSearchComponent,
    CaseDetailComponent,
    PartyDetailComponent,
    PartySearchComponent,
    AdminWorkflowComponent,
    AdminUsersComponent,
    LoginComponent,
    LoadingBarComponent,
    DropdownPipe,
    ReferenceDataIdToNamePipe,
    NamePipe,
    CustomAutocompleteComponent, ResetPasswordComponent, NewPasswordComponent
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    BreadcrumbService,
    GlobalState,
    DateParserService,
    DateValidatorService,
    DropdownDataTransformService,
    MessageService,
    ToastService,
    LanguageService,
    IdentifierService,
    PartyService,
    GenericTypesService,
    CountriesService,
    CaseService,
    LookupService,
    CanActivateAuthenticationGuard,
    CanActivateIsCourtUserGuard,
    AuthenticationService,
    LocalStorageService,
    UserService,
    DropdownPipe,
    ReferenceDataIdToNamePipe,
    NamePipe,
    AdminDataService,
    AdminUserService,
    CourtService,
    CalendarService,
    CalFacilityService,
    AppStateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    AuthenticationModel

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
