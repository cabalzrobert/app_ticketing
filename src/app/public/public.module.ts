import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { LandingModule } from './landing/landing.module';
import { LocalStorageService } from '../tools/plugins/localstorage';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    PublicComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    //LandingModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports:[MatIconModule, MatSelectModule],
  providers:[LocalStorageService]
})
export class PublicModule { }
