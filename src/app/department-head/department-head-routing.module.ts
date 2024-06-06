import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentHeadComponent } from './department-head.component';
import { OverviewComponent } from './overview/overview.component';
import { authChildGuard } from './auth-child.guard';
import { HeadTicketsComponent } from './head-tickets/head-tickets.component';
import { headAuthGuard } from './head-auth.guard';
import { TicketComponent } from './head-tickets/ticket/ticket.component';

const routes: Routes = [
  { path: 'head/dashboard', component: DepartmentHeadComponent, 
    canActivateChild: [authChildGuard], 
    children: [
    { path: 'overview', component: OverviewComponent }, 
    { path: 'tickets', component: HeadTicketsComponent,
      loadChildren: () => import('./head-tickets/head-tickets.module').then((m) => m.HeadTicketsModule)
     },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentHeadRoutingModule { }
