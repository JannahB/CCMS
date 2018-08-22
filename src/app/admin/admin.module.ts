import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DayPilotModule } from "daypilot-pro-angular";
import {
  AutoCompleteModule,
  ButtonModule,
  CalendarModule,
  CheckboxModule,
  DialogModule,
  DropdownModule
} from "primeng/primeng";
import { CustomMaterialModule } from "../common/modules/customMaterial.module";
import { NameFilterPipe } from "../common/pipes/name-filter.pipe";
import { YearFilterPipe } from "../common/pipes/year-filter.pipe";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { CalFacilitiesComponent } from "./calendar/cal-facilities/cal-facilities.component";
import { CalResourcesComponent } from "./calendar/cal-resources/cal-resources.component";
import { CalTemplatesComponent } from "./calendar/cal-templates/cal-templates.component";
import { HolidaysComponent } from "./calendar/holidays/holidays.component";
import { CasePartyRolesComponent } from "./data/case-party-roles/case-party-roles.component";
import { CasePhasesComponent } from "./data/case-phases/case-phases.component";
import { CaseStatusesComponent } from "./data/case-statuses/case-statuses.component";
import { CaseTypesComponent } from "./data/case-types/case-types.component";
import { CourtLocationsComponent } from "./data/court-locations/court-locations.component";
import { DataComponent } from "./data/data.component";
import { EventTypesComponent } from "./data/event-types/event-types.component";
import { HearingTypeComponent } from "./data/hearing-type/hearing-type.component";
import { IccsCodesComponent } from "./data/iccs-codes/iccs-codes.component";
import { AssignmentManagerComponent } from './assignment-manager/assignment-manager.component';

@NgModule({
  imports: [
    AutoCompleteModule,
    CalendarModule,
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    ButtonModule,
    DropdownModule,
    CustomMaterialModule,
    DialogModule,
    DayPilotModule,
    CheckboxModule
  ],
  declarations: [
    DataComponent,
    AdminComponent,
    CaseTypesComponent,
    CasePhasesComponent,
    CaseStatusesComponent,
    CourtLocationsComponent,
    CasePartyRolesComponent,
    EventTypesComponent,
    HearingTypeComponent,
    IccsCodesComponent,
    HolidaysComponent,
    CalTemplatesComponent,
    CalResourcesComponent,
    CalFacilitiesComponent,
    NameFilterPipe,
    YearFilterPipe,
    AssignmentManagerComponent
  ]
})
export class AdminModule {}
