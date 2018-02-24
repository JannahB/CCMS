import { NgModule } from '@angular/core';
import {MatButtonModule, MatSelectModule, MatListModule, MatIconModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  imports: [MatButtonModule, MatInputModule, MatIconModule, MatSelectModule, MatListModule, MatSlideToggleModule],
  exports: [MatButtonModule, MatInputModule, MatIconModule, MatSelectModule, MatListModule, MatSlideToggleModule],
})
export class CustomMaterialModule { }
