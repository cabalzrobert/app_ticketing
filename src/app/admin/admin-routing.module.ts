import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersPageComponent } from './users-page/users-page.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AssignedticketpageComponent } from './assignedticketpage/assignedticketpage.component';
import { CommunicationreceivedticketpageComponent } from './communicationreceivedticketpage/communicationreceivedticketpage.component';
import { RequestorticketpageComponent } from './requestorticketpage/requestorticketpage.component';
import { SuperadminpageComponent } from './superadminpage/superadminpage.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { CommunicatorTicketComponent } from './communicator-ticket/communicator-ticket.component';
import { HeadTicketsComponent } from './head-tickets/head-tickets.component';
import { MyTaskComponent } from './my-task/my-task.component';
import { ReportPageComponent } from './report/report-page.component';
// import { CommunicatorTicketComponent } from '../communicator/communicator-ticket/communicator-ticket.component';

const routes: Routes = [

  {
    path: '', component: AdminComponent, children: [
      { path: '', component: OverviewPageComponent },
      { path: 'overview', component: OverviewPageComponent },
      { path: 'report', component: ReportPageComponent },
      //{ path: 'dashboard', component: OverviewPageComponent },
      { path: 'assignedticket', component: HeadTicketsComponent, loadChildren: () => import('./head-tickets/head-tickets.module').then(m => m.HeadTicketsModule) },
      { path: 'receivedtickets', component: CommunicatorTicketComponent, loadChildren: () => import('./communicator-ticket/communicator-ticket.module').then(m => m.CommunicatorTicketModule) },
      { path: 'myTask', component: MyTaskComponent, loadChildren: () => import('./my-task/my-task.module').then(m => m.MyTaskModule) },
      //{path:'ticket', component:TicketMainPageComponent},
      //{ path: 'adminsettings', loadChildren:()=> import('./setting-main-page/setting-main-page.module').then((m) =>m.SettingMainPageModule)},
      // {
      //   path: 'ticket',
      //   loadChildren:()=> import('./ticket-main-page/ticket-main-page.module').then((m) =>m.TicketMainPageModule)
      // },
      { path: 'adminsettings', component: SuperadminpageComponent },
      { path: 'ticket', component: RequestorticketpageComponent },
      { path: 'users', component: UsersPageComponent },
      { path: 'chat', component: ChatPageComponent },

      { path: '**', redirectTo: '/' }
    ]
  }

  // { path: '', redirectTo: 'dashboard' },
  // { path: 'dashboard', component: UsersPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, ReactiveFormsModule,]
})
export class AdminRoutingModule { }
