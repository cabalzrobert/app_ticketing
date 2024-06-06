import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicatorRoutingModule } from './communicator-routing.module';
import { CommunicatorComponent } from './communicator.component';
import { OverviewComponent } from './overview/overview.component';
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
import { MatDialogModule } from '@angular/material/dialog';
import { CommunicatorTicketModule } from './communicator-ticket/communicator-ticket.module';


@NgModule({
  declarations: [
    CommunicatorComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    CommunicatorRoutingModule,
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
    CommunicatorTicketModule
  ]
})
export class CommunicatorModule { }
