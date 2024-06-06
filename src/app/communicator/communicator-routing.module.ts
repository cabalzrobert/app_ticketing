import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunicatorComponent } from './communicator.component';
import { OverviewComponent } from './overview/overview.component';
import { CommunicatorTicketComponent } from './communicator-ticket/communicator-ticket.component';

const routes: Routes = [
  { path: 'communicator/dashboard', component: CommunicatorComponent, children: [
    { path: 'overview', component: OverviewComponent },
    { path: 'tickets', component: CommunicatorTicketComponent, 
    loadChildren: () => import('./communicator-ticket/communicator-ticket.module').then(m=>m.CommunicatorTicketModule)}
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicatorRoutingModule { }
