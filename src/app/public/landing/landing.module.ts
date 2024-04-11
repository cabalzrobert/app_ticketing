import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LandingComponent
  ],
  exports: [
    LandingComponent
  ],
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule
  ]
})
export class LandingModule { }
