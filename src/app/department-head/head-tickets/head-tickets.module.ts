import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeadTicketsRoutingModule } from './head-tickets-routing.module';
import { TicketComponent } from './ticket/ticket.component';
import { DepartmentHeadComponent } from '../department-head.component';
import { ForwardDialog, HeadTicketsComponent, MessageBoxDialog } from './head-tickets.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatRippleModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { NewTicketDialogComponent } from './modal/new-ticket-dialog/new-ticket-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HeadTicketsComponent,
    TicketComponent,
    NewTicketDialogComponent,
    MessageBoxDialog,
    ForwardDialog
  ],
  imports: [
    CommonModule,
    HeadTicketsRoutingModule,
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
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule
  ]
})
export class HeadTicketsModule { }
