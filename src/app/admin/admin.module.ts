import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UsersPageComponent } from './users-page/users-page.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { BodyComponent } from '../body/body.component';
import { TicketPageComponent } from './ticket-page/ticket-page.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { TicketMainPageComponent } from './ticket-main-page/ticket-main-page.component';
import { NewticketmodalComponent } from './ticket-main-page/newticketmodal/newticketmodal.component';
import { NewusermodalComponent } from './users-page/newusermodal/newusermodal.component';
//import { SettingMainPageComponent } from './setting-main-page/setting-main-page.component';
import { CommunicationreceivedticketpageComponent } from './communicationreceivedticketpage/communicationreceivedticketpage.component';
import { MatIconModule } from '@angular/material/icon';
import { NewDepartmentModalComponent } from './modalpage/new-department-modal/new-department-modal.component';
import { VIewDepartmentModalComponent } from './modalpage/view-department-modal/view-department-modal.component';
import { SuperadminpageComponent } from './superadminpage/superadminpage.component';
//import { SettingsdepartmentComponent } from './setting-main-page/settingsdepartment/settingsdepartment.component';
//import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    AdminComponent,
    SidenavComponent,
    UsersPageComponent,
    TicketPageComponent,
    BodyComponent,
    NewticketmodalComponent,
    OverviewPageComponent,
    ChatPageComponent,
    TicketMainPageComponent,
    NewusermodalComponent,
    CommunicationreceivedticketpageComponent,
    NewDepartmentModalComponent,
    VIewDepartmentModalComponent,
    SuperadminpageComponent
  ],
  imports: [
    CommonModule,
    //BrowserModule,
    //BrowserAnimationsModule,
    AdminRoutingModule,
    MatIconModule

  ],
  exports:[MatIconModule]
})
export class AdminModule { }
