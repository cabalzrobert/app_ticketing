import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersPageComponent } from './users-page/users-page.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AssignedticketpageComponent } from './assignedticketpage/assignedticketpage.component';

const routes: Routes = [

  {
    path: '', component: AdminComponent, children: [
      { path: 'overview', component: OverviewPageComponent },
      { path: 'dashboard', component: OverviewPageComponent },
      { path: 'assignedticket', component:AssignedticketpageComponent},
      //{path:'ticket', component:TicketMainPageComponent},
      {
        path: 'adminsettings',
        loadChildren:()=> import('./setting-main-page/setting-main-page.module').then((m) =>m.SettingMainPageModule)
      },
      {
        path: 'ticket',
        loadChildren:()=> import('./ticket-main-page/ticket-main-page.module').then((m) =>m.TicketMainPageModule)
      },
      { path: 'users', component: UsersPageComponent },
      { path: 'chat', component: ChatPageComponent },
    ]
  }

  // { path: '', redirectTo: 'dashboard' },
  // { path: 'dashboard', component: UsersPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, ReactiveFormsModule]
})
export class AdminRoutingModule { }
