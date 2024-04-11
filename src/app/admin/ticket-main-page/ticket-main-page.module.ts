import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketMainPageRoutingModule } from './ticket-main-page-routing.module';
import { TicketpendingComponent } from './ticketpending/ticketpending.component';
import { TicketresolveComponent } from './ticketresolve/ticketresolve.component';
import { TicketallComponent } from './ticketall/ticketall.component';
import { NewticketmodalComponent } from './newticketmodal/newticketmodal.component';


@NgModule({
  declarations: [
    TicketpendingComponent,
    TicketresolveComponent,
    TicketallComponent,
    //NewticketmodalComponent
  ],
  imports: [
    CommonModule,
    TicketMainPageRoutingModule
  ]
})
export class TicketMainPageModule { }
