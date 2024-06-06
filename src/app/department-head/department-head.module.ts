import { NgModule } from '@angular/core';

import { DepartmentHeadRoutingModule } from './department-head-routing.module';
import { DepartmentHeadComponent } from './department-head.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { OverviewComponent } from './overview/overview.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { HeadTicketsComponent } from './head-tickets/head-tickets.component';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatRippleModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
// import { HeadTicketsModule } from './head-tickets/head-tickets.module';
// import { HeadTicketsRoutingModule } from './head-tickets/head-tickets-routing.module';
import { TicketComponent } from './head-tickets/ticket/ticket.component';
import { HeadTicketsModule } from './head-tickets/head-tickets.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    DepartmentHeadComponent,
    OverviewComponent,
  ],
  imports: [
    DepartmentHeadRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatBadgeModule,
    MatCardModule,
    MatChipsModule,
    ScrollingModule,
    MatRippleModule,
    MatStepperModule,
    MatToolbarModule,
    MatSelectModule,
    HeadTicketsModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class DepartmentHeadModule { }
