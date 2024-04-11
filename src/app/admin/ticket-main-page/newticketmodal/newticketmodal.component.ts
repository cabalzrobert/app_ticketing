import { Component } from '@angular/core';
import { GeneralService } from '../../../shared/services/general.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-newticketmodal',
  templateUrl: './newticketmodal.component.html',
  styleUrl: './newticketmodal.component.scss'
})
export class NewticketmodalComponent {
constructor(public generalSerive:GeneralService, public dialogRef: MatDialogRef<NewticketmodalComponent>){}
closedialogNewTicket():void{
  this.dialogRef.close();
}
}
