import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatRippleModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommunicatorTicketComponent } from './communicator-ticket/communicator-ticket.component';
import { CommunicatorTicketModule } from './communicator-ticket/communicator-ticket.module';
import { TicketComponent } from './communicator-ticket/ticket/ticket.component';
import { HeadTicketsModule } from './head-tickets/head-tickets.module';
import { HeadTicketsComponent } from './head-tickets/head-tickets.component';
import { TicketProgressModalComponent } from './modalpage/ticket-progress-modal/ticket-progress-modal.component';
import { SubmitModalComponent } from './modalpage/submit-modal/submit-modal.component';
import { AlertSuccessModalComponent } from './modalpage/alert-success-modal/alert-success-modal.component';
import { ViewAttachImageModalComponent } from './modalpage/view-attach-image-modal/view-attach-image-modal.component';
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
    ViewRolesModalComponent,
    CommunicatorTicketComponent,
    HeadTicketsComponent,
    TicketProgressModalComponent,
    SubmitModalComponent,
    AlertSuccessModalComponent,
    ViewAttachImageModalComponent
    // TicketComponent
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
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatTabsModule,
    MatBadgeModule,
    MatCardModule,
    MatChipsModule,
    ScrollingModule,
    MatRippleModule,
    MatStepperModule,
    MatToolbarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    CommunicatorTicketModule,
    HeadTicketsModule
    //SidenavComponent
    
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports:[MatIconModule, MatSelectModule],
  providers:[LocalStorageService]
})
export class AdminModule { }
