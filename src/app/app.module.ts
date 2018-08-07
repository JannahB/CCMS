import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy
} from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MessageService } from "primeng/components/common/messageservice";
import {
  AccordionModule,
  AutoCompleteModule,
  BreadcrumbModule,
  ButtonModule,
  CalendarModule,
  CheckboxModule,
  ChipsModule,
  ConfirmDialogModule,
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
  InputTextareaModule,
  InputTextModule,
  LightboxModule,
  ListboxModule,
  MenubarModule,
  MenuModule,
  MessageModule,
  MessagesModule,
  MultiSelectModule,
  OrderListModule,
  OrganizationChartModule,
  OverlayPanelModule,
  PanelMenuModule,
  PanelModule,
  PasswordModule,
  ProgressBarModule,
  ProgressSpinnerModule,
  RadioButtonModule,
  RatingModule,
  ScheduleModule,
  SelectButtonModule,
  SharedModule,
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
  TreeTableModule
} from "primeng/primeng";
import "rxjs/add/operator/toPromise";
import { AdminUsersComponent } from "./admin/admin-users/admin-users.component";
import { AdminWorkflowComponent } from "./admin/admin-workflow/admin-workflow.component";
import { AdminModule } from "./admin/admin.module";
import { AppBreadcrumbComponent } from "./app.breadcrumb.component";
import { AppComponent } from "./app.component";
import { AppFooterComponent } from "./app.footer.component";
import { AppMenuComponent, AppSubMenuComponent } from "./app.menu.component";
import { AppInlineProfileComponent } from "./app.profile.component";
import { AppRightpanelComponent } from "./app.rightpanel.component";
import { AppRoutes } from "./app.routes";
import { AppTopbarComponent } from "./app.topbar.component";
import { BreadcrumbService } from "./breadcrumb.service";
import { CaseDetailComponent } from "./case/case-detail/case-detail.component";
import { CaseSearchComponent } from "./case/case-search/case-search.component";
import { CustomAutocompleteComponent } from "./common/components/custom-autocomplete/custom-autocomplete.component";
import { LoadingBarComponent } from "./common/components/loading-bar.component";
import { CanActivateAuthenticationGuard } from "./common/guards/can-activate-authentication.guard";
import { CanActivateIsCourtUserGuard } from "./common/guards/can-activate-is-court-user.guard";
import { AuthorizationInterceptor } from "./common/interceptors/authorization.interceptor";
import { AuthenticationModel } from "./common/model/authentication-model";
import { CustomMaterialModule } from "./common/modules/customMaterial.module";
import { DropdownPipe } from "./common/pipes/dropdown.pipe";
import { NamePipe } from "./common/pipes/name.pipe";
import { ReferenceDataIdToNamePipe } from "./common/pipes/reference-data-id-to-name.pipe";
import { HolidayService } from "./common/services/holiday.service";
import { AdminDataService } from "./common/services/http/admin-data.service";
import { AdminUserService } from "./common/services/http/admin-user.service";
import { AuthenticationService } from "./common/services/http/authentication.service";
import { CalFacilityService } from "./common/services/http/calFacility.service";
import { CalResourceService } from "./common/services/http/calResource.service";
import { CalTemplateService } from "./common/services/http/calTemplate.service";
import { CaseService } from "./common/services/http/case.service";
import { CountriesService } from "./common/services/http/countries.service";
import { CourtService } from "./common/services/http/court.service";
import { GenericTypesService } from "./common/services/http/generic.types.service";
import { IdentifierService } from "./common/services/http/identifier.service";
import { LanguageService } from "./common/services/http/language.service";
import { LookupService } from "./common/services/http/lookup.service";
import { PartyService } from "./common/services/http/party.service";
import { AppStateService } from "./common/services/state/app.state.sevice";
import { CaseCountsService } from './common/services/http/case-counts.service';
import { GlobalState } from "./common/services/state/global.state";
import { DateParserService } from "./common/services/utility/dates/date-parser.service";
import { DateValidatorService } from "./common/services/utility/dates/date-validator.service";
import { DropdownDataTransformService } from "./common/services/utility/dropdown-data-transform.service";
import { GlobalErrorHandlerService } from "./common/services/utility/global-error-handler.service";
import { LocalStorageService } from "./common/services/utility/local-storage.service";
import { ToastService } from "./common/services/utility/toast.service";
import { UserService } from "./common/services/utility/user.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { NewPasswordComponent } from "./login/new-password/new-password.component";
import { ResetPasswordComponent } from "./login/reset-password/reset-password.component";
import { PartyDetailComponent } from "./party/party-detail/party-detail.component";
import { PartySearchComponent } from "./party/party-search/party-search.component";
import { CaseCountsComponent } from './reports/case-counts/case-counts.component';

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
    CustomAutocompleteComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
    CaseCountsComponent
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
    CalTemplateService,
    CalFacilityService,
    CalResourceService,
    HolidayService,
    AppStateService,
    CaseCountsService,
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
