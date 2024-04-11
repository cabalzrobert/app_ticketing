import { Component } from '@angular/core';
import { menubarData } from './menubarData';
import { GeneralService } from '../../shared/services/general.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NewticketmodalComponent } from './newticketmodal/newticketmodal.component';

@Component({
  selector: 'app-ticket-main-page',
  templateUrl: './ticket-main-page.component.html',
  styleUrl: './ticket-main-page.component.scss'
})
export class TicketMainPageComponent {

  menuData = menubarData;
  constructor(public dialog:MatDialog, public generalSerive: GeneralService){}
  openpopnewticket(){
    this.generalSerive.showDialog = false;
    this.dialog.open(NewticketmodalComponent,{
      width:'fit-content',
      height:'fit-content'
    });
  }
}
