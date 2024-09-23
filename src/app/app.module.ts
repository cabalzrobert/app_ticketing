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
// import { MatIconModule } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SuperadminpageComponent } from './admin/superadminpage/superadminpage.component';
//import { SuperadminpageComponent } from './superadminpage/superadminpage.component';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import{MatMenuModule} from '@angular/material/menu'
import { RxStompService } from './tools/plugins/rx-stomp.service';
import { rxStompServiceFactory } from './tools/plugins/rx-stomp-service-factory';
import { LocalStorageService } from './tools/plugins/localstorage';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NewUserLoginComponent } from './new-user-login/new-user-login.component';
import { OtpComponent } from './otp/otp.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NewUserAccessProfileModalComponent } from './new-user-access-profile-modal/new-user-access-profile-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LineClampComponent } from './+lineclamp/line-clamp.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeadquarterComponent,
    AssignedticketpageComponent,
    RequestorticketpageComponent,
    NewUserLoginComponent,
    OtpComponent,
    SetPasswordComponent,
    NewUserAccessProfileModalComponent,
    LineClampComponent
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
    MatDatepickerModule,
    NgxMatSelectSearchModule,
    
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    NgOtpInputModule,
    MatToolbarModule,
    ScrollingModule,
    NgbModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    LocalStorageService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
