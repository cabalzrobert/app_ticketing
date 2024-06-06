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
import { NewCategoryModalComponent } from './modalpage/new-category-modal/new-category-modal.component';
import { ViewCategoryModalComponent } from './modalpage/view-category-modal/view-category-modal.component';
import { NewPositionModalComponent } from './modalpage/new-position-modal/new-position-modal.component';
import { ViewPositionModalComponent } from './modalpage/view-position-modal/view-position-modal.component';
import { NewRolesModalComponent } from './modalpage/new-roles-modal/new-roles-modal.component';
import { ViewRolesModalComponent } from './modalpage/view-roles-modal/view-roles-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { WebSocketService } from '../web-socket.service';
import { stomp } from '../+services/stomp.service';
import { LocalStorageService } from '../tools/plugins/localstorage';
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
    SuperadminpageComponent,
    NewCategoryModalComponent,
    ViewCategoryModalComponent,
    NewPositionModalComponent,
    ViewPositionModalComponent,
    NewRolesModalComponent,
    ViewRolesModalComponent
  ],
  imports: [
    CommonModule,
    //BrowserModule,
    //BrowserAnimationsModule,
    AdminRoutingModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    //SidenavComponent
    
  ],
  exports:[MatIconModule, MatSelectModule],
  providers:[LocalStorageService]
})
export class AdminModule { }
