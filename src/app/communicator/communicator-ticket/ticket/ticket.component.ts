import { Component, Inject, Input, ViewChild } from '@angular/core';
import { rest } from '../../../+services/services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageBoxDialog } from '../communicator-ticket.component';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {

  @Input() detail: any;
  @Input() messageHandler: any;
  _message: any;
  // messageHandler: any = [];
  userId = '00020010000001';
  data: any = {};

  constructor(private dialog: MatDialog){}

  ngOnInit() {
    // console.log(this.detail);
    // alert('Ni refresh');
    // this.messageHandler = [...this.messageHandler,{Message: 'test', isMessage: true}];
    // setTimeout(()=>this.performGetTicketComments());
  }

  // performGetTicketComments = async () => {
  //   rest.post(`communicator/ticket/comments?transactionNo=${this.detail.transactionNo}`,{}).subscribe((res: any) => {
  //     if (res) {
  //       // this.messageHandler = [...this.messageHandler,res];
  //       this.messageHandler = res;
  //       console.log(this.messageHandler);
  //       return
  //     }
  //     alert('Failed');
  //   }, (error: any) => {
  //     alert('System Error!');
  //   });
  // }

  sendMessage() {
    console.log(this._message);
    if(!this._message) return;
    // this.messageHandler = [...this.messageHandler, { value: this.message, isLeft: 1, isMessage: true }];
    // this.messageHandler.push({value: val, isLeft: 1});
    this._message = null;
    // console.log(this.messageHandler);
  }

  onDecline(message: any, id: any) {
    console.log(id);
    message.id = id;
    this.data.commentId = message.commentId;
    this.data.ticketNo = this.detail.ticketNo;
    this.data.permission = 0;
    const dialogRef = this.dialog.open(CancelDialog, {
      disableClose: true,
      width: '20%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe((result:any)=>{
      if(result){
        message.message = result;
        message.permissionStatus = 0;
        this.messageHandler.splice(message.id,1,message);
        this.detail.isForwarded = false;
      }
    });
  }

  performPermissionForward(message: any) {
    rest.post('communicator/ticket/forward/permission', this.data).subscribe((res: any) => {
      if (res.Status === 'ok') {
        message.message = this.data.forwardRemarks;
        message.permissionStatus = this.data.permission;
        if(message)
          this.messageHandler.splice(message.id,1,message);
        this.detail.isForwarded = false;
        return
      }
      alert('Failed');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  onAccept(message: any, id: any) {
    message.id = id;
    // message.message = 'Request has been accepted';
    this.data.commentId = message.commentId;
    this.data.ticketNo = this.detail.ticketNo;
    this.data.forwardDepartment = this.detail.forwardDepartmentId;
    this.data.forwardTo = this.detail.forwardToId;
    this.data.forwardRemarks = 'Request has been accepted';
    this.data.permission = 1;
    setTimeout(() => this.performPermissionForward(message));
  }
}

@Component({
  selector: 'app-cancel-dialog',
  templateUrl: '../modal/cancel-dialog.html',
  styleUrl: '../modal/cancel-dialog.scss'
})
export class CancelDialog {

  remarks: any;
  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<TicketComponent>, @Inject(MAT_DIALOG_DATA) public data: any){

  }

  setRemarks(val: string){
    this.data.forwardRemarks = val;
  }

  onConfirm(){
    const dialogRef = this.showMessageBox(true,false,null);
    setTimeout(()=>this.performPermissionForward(dialogRef),725);
  }

  performPermissionForward(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post('communicator/ticket/forward/permission', this.data).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox(false,true,'Permission to forward has been declined');
        dialogRef.afterClosed().subscribe(()=>{
          this.dialogRef.close(this.data.forwardRemarks);
        })
        // message.message = this.data.remarks;
        // message.permissionStatus = this.data.permission;
        // if(message)
        //   this.messageHandler.splice(message.id,1,message);
        // this.detail.isForwarded = false;
        return
      }
      alert('Failed');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  showMessageBox(isProgress: boolean, isMessage: boolean, message: any): any {
    return this.dialog.open(MessageBoxDialog, {
      disableClose: true,
      width: isMessage?'20%':'auto',
      data: { isProgress: isProgress, isMessage: isMessage, message: message }
    });
  }
}


