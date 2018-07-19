import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

import { DataComponent } from './data/data.component';
import { AdminComponent } from './admin.component';
import { CaseTypesComponent } from './data/case-types/case-types.component';
import { CasePhasesComponent } from './data/case-phases/case-phases.component';
import { AutoCompleteModule, ButtonModule, CalendarModule, DropdownModule, DialogModule } from 'primeng/primeng';
import { CustomMaterialModule } from '../common/modules/customMaterial.module';
import { CaseStatusesComponent } from './data/case-statuses/case-statuses.component';
import { CourtLocationsComponent } from './data/court-locations/court-locations.component';
import { CasePartyRolesComponent } from './data/case-party-roles/case-party-roles.component';
import { EventTypesComponent } from './data/event-types/event-types.component';
import { HearingTypeComponent } from './data/hearing-type/hearing-type.component';
import { IccsCodesComponent } from './data/iccs-codes/iccs-codes.component';
import { HolidaysComponent } from './calendar/holidays/holidays.component';
import { CalTemplatesComponent } from './calendar/cal-templates/cal-templates.component';
import { CalResourcesComponent } from './calendar/cal-resources/cal-resources.component';
import { CalFacilitiesComponent } from './calendar/cal-facilities/cal-facilities.component';
import { DayPilotModule } from "daypilot-pro-angular";

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
    DayPilotModule

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
    CalFacilitiesComponent
  ]
})
export class AdminModule { }
