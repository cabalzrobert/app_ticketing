import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { rest } from '../../../+services/services';

@Component({
  selector: 'app-ticket-progress-modal',
  templateUrl: './ticket-progress-modal.component.html',
  styleUrl: './ticket-progress-modal.component.scss'
})
export class TicketProgressModalComponent implements OnInit {


  title: String = '';
  ticketrolve:any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public Ticket: { item: any, Title: String }, public diaglogRef: MatDialogRef<TicketProgressModalComponent>) { }
  ngOnInit(): void {
    this.title = this.Ticket.Title;
    this.ticketrolve = this.Ticket.item;
    console.log('Ticket Progress ngOnit', this.Ticket.item);
  }
  closeddialog(): void {
    this.diaglogRef.close();
  } 
  hConfirmTicket() {
    console.log('hConfirmationTicket', this.Ticket.item);
    //this.diaglogRef.close(this.Ticket.item);
    setTimeout(() => this.performResolveTicket(this.Ticket.item), 750);
  }

  performResolveTicket(item: any) {
    //console.log('performSendComment item', item.FileAttachment);
    rest.post('ticket/resolve', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.diaglogRef.close(item);
        return;
      }
      else {
        alert(res.Message);
      }
    });
  }
  
}
