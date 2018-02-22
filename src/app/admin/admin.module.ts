import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

import { DataComponent } from './data/data.component';
import { AdminComponent } from './admin.component';
import { CaseTypesComponent } from './data/case-types/case-types.component';
import { CasePhasesComponent } from './data/case-phases/case-phases.component';
import { ButtonModule, DropdownModule } from 'primeng/primeng';
import { CustomMaterialModule } from '../common/modules/customMaterial.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    ButtonModule,
    DropdownModule,
    CustomMaterialModule

  ],
  declarations: [DataComponent, AdminComponent, CaseTypesComponent, CasePhasesComponent]
})
export class AdminModule { }
