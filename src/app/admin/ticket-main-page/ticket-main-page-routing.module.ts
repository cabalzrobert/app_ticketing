import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketMainPageComponent } from './ticket-main-page.component';
import { TicketpendingComponent } from './ticketpending/ticketpending.component';
import { TicketresolveComponent } from './ticketresolve/ticketresolve.component';
import { TicketallComponent } from './ticketall/ticketall.component';

const routes: Routes = [
  {
    path:'',component:TicketMainPageComponent,children:[
      {path:'',component:TicketpendingComponent},
      {path:'pending',component:TicketpendingComponent},
      {path:'resolve',component:TicketresolveComponent},
      {path:'all',component:TicketallComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketMainPageRoutingModule { }
