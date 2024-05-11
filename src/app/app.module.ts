import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeadquarterComponent } from './headquarter/headquarter.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BodyComponent } from './body/body.component';
import { AssignedticketpageComponent } from './admin/assignedticketpage/assignedticketpage.component';
import { RequestorticketpageComponent } from './admin/requestorticketpage/requestorticketpage.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SuperadminpageComponent } from './admin/superadminpage/superadminpage.component';
//import { SuperadminpageComponent } from './superadminpage/superadminpage.component';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import{MatMenuModule} from '@angular/material/menu'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeadquarterComponent,
    AssignedticketpageComponent,
    RequestorticketpageComponent,
    //SuperadminpageComponent,
    //SidenavComponent,
    //BodyComponent
  ],
  imports: [
    BrowserModule,
    //BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatMenuModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
