import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ticket-description-modal',
  templateUrl: './ticket-description-modal.component.html',
  styleUrl: './ticket-description-modal.component.scss'
})
export class TicketDescriptionModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public details: { ticketDetails: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<TicketDescriptionModalComponent>) { }
  _ticketdetails: any;
  ngOnInit(): void {
    this._ticketdetails = this.details;
  }
  closeddialog(): void {
    //console.log('You close this dialog');
    this.dialogRef.close();
  }
}
