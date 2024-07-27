import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketMainPageRoutingModule } from './ticket-main-page-routing.module';
import { TicketpendingComponent } from './ticketpending/ticketpending.component';
import { TicketresolveComponent } from './ticketresolve/ticketresolve.component';
import { TicketallComponent } from './ticketall/ticketall.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    TicketpendingComponent,
    TicketresolveComponent,
    TicketallComponent,
    //NewticketmodalComponent
  ],
  imports: [
    CommonModule,
    TicketMainPageRoutingModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDialogModule
  ]
})
export class TicketMainPageModule { }
