import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-modal',
  templateUrl: './submit-modal.component.html',
  styleUrl: './submit-modal.component.scss'
})
export class SubmitModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public submit: { item: any }, public diaglogRef: MatDialogRef<SubmitModalComponent>) { }
  

  Header:string = '';
  Message:string = '';
  data:any = {}
  ngOnInit(): void {
    this.Header = this.submit.item.Header;
    this.Message = this.submit.item.Message;
    this.data=this.submit;
  }
  closeddialog(): void {
    this.data.item.isConfirm = false;
    this.diaglogRef.close(this.data);
  } 
  hConfirmTicket() {
    this.data.item.isConfirm = true;
    
    this.diaglogRef.close(this.data);
  }
}
