import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunicatorTicketComponent } from './communicator-ticket.component';
import { TicketComponent } from './ticket/ticket.component';

const routes: Routes = [
  { path: ':id', component: TicketComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicatorTicketRoutingModule { }
