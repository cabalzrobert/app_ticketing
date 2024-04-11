import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsystemRoutingModule } from './ticketsystem-routing.module';
import { TicketsysteComponent } from './ticketsyste.component';
import { TicketPageComponent } from '../admin/ticket-page/ticket-page.component';


@NgModule({
  declarations: [
    TicketsysteComponent,
    //TicketPageComponent,
    
    
  ],
  imports: [
    CommonModule,
    TicketsystemRoutingModule
  ]
})
export class TicketsystemModule { }
