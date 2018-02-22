import { NgModule } from '@angular/core';
import {MatButtonModule, MatSelectModule, MatListModule, MatIconModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  imports: [MatButtonModule, MatInputModule, MatIconModule, MatSelectModule, MatListModule],
  exports: [MatButtonModule, MatInputModule, MatIconModule, MatSelectModule, MatListModule],
})
export class CustomMaterialModule { }
