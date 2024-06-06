import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivateChild } from '@angular/router';
import { HeadTicketsComponent } from './head-tickets.component';
import { ticketAuthGuard } from './ticket-auth.guard';
import { ticketAuthChildGuard } from './ticket-auth-child.guard';
import { TicketComponent } from './ticket/ticket.component';

const routes: Routes = [
    {path: ':id', component: HeadTicketsComponent}
  // {path: '', component: HeadTicketsComponent, children:[
  //   {path: ':id', component: TicketComponent}
  // ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeadTicketsRoutingModule { }
