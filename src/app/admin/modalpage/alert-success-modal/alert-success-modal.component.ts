import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-success-modal',
  templateUrl: './alert-success-modal.component.html',
  styleUrl: './alert-success-modal.component.scss'
})
export class AlertSuccessModalComponent implements OnInit {
  Icon: string = '';
  Message: string = '';
  ButtonText: string = '';
  isConfirm:boolean = false;
  data:any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public success: { item: any }, public diaglogRef: MatDialogRef<AlertSuccessModalComponent>) { }
  ngOnInit(): void {
    this.Icon = this.success.item.Icon;
    this.Message = this.success.item.Message;
    this.ButtonText = this.success.item.ButtonText;
    this.isConfirm = this.success.item.isConfirm;
    this.data = this.success;
    console.log('ngOnit', this.data);
  }
  closeddialog(): void {
    this.data.item.isConfirm = true;
    this.diaglogRef.close(this.data);
  }
}
