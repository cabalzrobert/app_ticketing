import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-success-modal-department',
  templateUrl: './alert-success-modal-department.component.html',
  styleUrl: './alert-success-modal-department.component.scss'
})
export class AlertSuccessModalDepartmentComponent {
  Icon: string = '';
  Header:string = ''
  Message: string = '';
  ButtonText: string = '';
  isConfirm:boolean = false;
  data:any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public success: { item: any }, public diaglogRef: MatDialogRef<AlertSuccessModalDepartmentComponent>) { }
  ngOnInit(): void {
    this.Icon = this.success.item.Icon;
    this.Header = this.success.item.Header;
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
