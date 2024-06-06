import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { NewTicketDialogComponent } from './modal/new-ticket-dialog/new-ticket-dialog.component';
import { rest } from '../../+services/services';
import { tick } from '@angular/core/testing';
import moment from 'moment';

export interface DialogData {
  Type: string,
  Message: string,
  ticketNo: string
}



@Component({
  selector: 'app-head-tickets',
  templateUrl: './head-tickets.component.html',
  styleUrl: './head-tickets.component.scss'
})
export class HeadTicketsComponent {

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog) { }
  @ViewChild('stepper') stepper!: MatStepper;

  height = 'height: calc(100% - 100px)';
  isTicketContentShow = false;
  collections: any = [];
  ticketTitle = '';
  ticketDetail: any;
  personnels: any = [];
  // [
  //   {
  //     id: '00020010000001',
  //     name: 'Caballero, Robert'
  //   },
  //   {
  //     id: '00020010000003',
  //     name: 'Dela Cruz, Juan Sr. S.'
  //   }
  // ];
  userId = '00020010000003';

  tab = 0;

  ngOnInit() {
    // alert('Yeeee');
    this.onTabChange(0);
  }

  onTabChange(val: any) {
    this.tab = val;
    rest.post(`head/tickets?id=${'00103'}&tab=${val}`).subscribe((res: any) => {
      if (res != null) {
        console.log(res);
        this.collections = res;
        this.collections.forEach((e: any) => {
          e.dateCreated = moment(e.dateCreated).format('DD MMM yyyy');
        });
        return;
      }
      alert('Failed');
    }, (err: any) => {
      alert('System Error');
    })
  }

  dateFormatted(isList:boolean, date: any){
    if(isList){
      const formattedDate = moment(date).format('D MMM');
      let splitDate = formattedDate.split(' ');
      if(splitDate[0]==='1'||splitDate[0]==='21'||splitDate[0]==='31')
        splitDate[0] = splitDate[0] + 'st';
      else if(splitDate[0]==='2'||splitDate[0]==='22')
        splitDate[0] = splitDate[0] + 'nd';
      else if(splitDate[0]==='3'||splitDate[0]==='23')
        splitDate[0] = splitDate[0] + 'rd';
      else
        splitDate[0] = splitDate[0] + 'th';
  
      return `${splitDate[0]} ${splitDate[1]}`;
    }
    else{
      return moment(date).format('DD MMM yyyy');
    }
  }

  getDepartmentPersonnels = async () => {
    const search: any = { num_row: 0, Search: '' };
    rest.post(`head/personnels?departmentId=${this.ticketDetail.departmentId}`).subscribe((res: any) => {
      console.log(res);
      if (res.Status === 'ok') {
        this.personnels = res.personnels;
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  next(item: any) {
    // if(item.isAssigned) return;
    this.router.navigate([item.ticketNo], { relativeTo: this.route });
    // this.router.navigateByUrl('/head/dashboard/tickets/sample');
    this.ticketTitle = item.title;
    this.ticketDetail = item;
    this.stepper.next();
    if(!item.isAssigned)
      setTimeout(()=>this.getDepartmentPersonnels());
  }

  goBack() {
    // this.router.navigate(['../tickets'], {relativeTo: this.route});
    this.router.navigate(['../tickets'], { relativeTo: this.route });
    this.stepper.previous();
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewTicketDialogComponent, {
      width: '25%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.collections = [...this.collections, result];
      console.log(this.collections);
    });
  }

  onSelectAssignee(personnel: any) {
    this.ticketDetail.assignedTo = personnel.userId;
  }

  onAssigningTicket() {
    if (!this.ticketDetail.assignedTo) return;
    const dialogRef = this.showMessageBox('progress', null, null);
    setTimeout(() => this.onSubmitAssignTicket(dialogRef), 725);
  }

  onSubmitAssignTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post('head/ticket/assign', this.ticketDetail).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been assigned.');
        dialogRef.afterClosed().subscribe(() => {
          this.goBack();
          this.onTabChange(this.tab);
        })
        return;
      }
      ref.close();
      alert('Failed');
    }, (err: any) => {
      ref.close();
      alert('System Error!');
    });
  }

  onReturningTicket() {
    const dialogRef = this.showMessageBox('progress', null, null);
    setTimeout(() => this.onSubmitReturnTicket(dialogRef), 725);
  }

  onSubmitReturnTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post('head/ticket/return', this.ticketDetail).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been returned.');
        dialogRef.afterClosed().subscribe(() => {
          this.goBack();
          this.onTabChange(this.tab);
        })
        return;
      }
      ref.close();
      alert('Failed');
    }, (err: any) => {
      ref.close();
      alert('System Error!');
    });
  }


  forwardingTicket() {
    const dialogRef = this.dialog.open(ForwardDialog, {
      data: { ticketNo: this.ticketDetail.ticketNo }
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.ticketDetail.isForwarded=true;
      }
    });
  }

  onResolvingTicket() {
    const dialogRef = this.showMessageBox('confirmation',this.ticketDetail.ticketNo, null);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result) {
        this.ticketDetail.status = 6;
        // this.goBack();
        // this.onTabChange(this.tab);
        
      }
    })
  }

  // onPerformResolveTicket(ref: MatDialogRef<MessageBoxDialog>) {
  //   rest.post(`head/ticket/resolve?ticketNo=${this.ticketDetail.ticketNo}`).subscribe((res: any) => {
  //     if (res.Status === 'ok') {
  //       ref.close();
  //       const dialogRef = this.showMessageBox('message', 'Ticket has been resolved.');
  //       dialogRef.afterClosed().subscribe(() => {
  //         this.goBack();
  //         this.onTabChange(this.tab);
  //       })
  //       return;
  //     }
  //     alert('Failed');
  //     ref.close();
  //   }, (err: any) => {
  //     alert('System Error!');
  //     ref.close();
  //   })
  // }

  showMessageBox(type: string, ticketNo: any, message: any): any {
    return this.dialog.open(MessageBoxDialog, {
      disableClose: true,
      width: type !== 'progress' ? '20%' : 'auto',
      data: { Type: type, Message: message, ticketNo: ticketNo }
    });
  }
}


@Component({
  selector: 'app-message-box-dialog',
  templateUrl: 'modal/message-box-dialog.html',
  styleUrl: 'modal/message-box-dialog.scss',
})
export class MessageBoxDialog {

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<HeadTicketsComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  confirm() {
    const dialogRef = this.showMessageBox('progress',null,null);
    setTimeout(()=>this.onPerformResolveTicket(dialogRef),725);
  }

  onPerformResolveTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post(`head/ticket/resolve?ticketNo=${this.data.ticketNo}`).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been resolved.');
        dialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close(true);
        })
        return;
      }
      alert('Failed');
      ref.close();
    }, (err: any) => {
      alert('System Error!');
      ref.close();
    })
  }

  showMessageBox(type: string, ticketNo: any, message: any): any {
    return this.dialog.open(MessageBoxDialog, {
      disableClose: true,
      width: type !== 'progress' ? '20%' : 'auto',
      data: { Type: type, Message: message, ticketNo: ticketNo }
    });
  }
}

@Component({
  selector: 'app-forward-dialog',
  templateUrl: 'modal/forward-dialog.html',
  styleUrl: 'modal/forward-dialog.scss',
})
export class ForwardDialog {

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<HeadTicketsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  departments: any = [];
  personnels: any = [];
  forwardData: any = {};

  ngOnInit() {
    setTimeout(() => this.getDepartmentList());
  }


  getDepartmentList = async () => {
    const search: any = { num_row: 0, Search: '' };
    rest.post('department/list', search).subscribe((res: any) => {
      console.log(res);
      if (res.Status === 'ok') {
        this.departments = res.department;
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  getDepartmentPersonnels = async () => {
    const search: any = { num_row: 0, Search: '' };
    rest.post(`head/personnels?departmentId=${this.data.forwardDepartment}`).subscribe((res: any) => {
      console.log(res);
      if (res.Status === 'ok') {
        this.personnels = res.personnels;
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  selectDepartment(val: string) {
    this.data.forwardDepartment = val;
    setTimeout(() => this.getDepartmentPersonnels());
  }

  selectPersonnel(val: string) {
    this.data.forwardTo = val;
  }

  setRemarks(val: string) {
    this.data.forwardRemarks = val;
  }

  onConfirmForwardTicket() {
    const dialogRef = this.showMessageBox('progress', null, null);
    this.data.status = 3;
    setTimeout(() => this.onPerformConfirmForwardTicket(dialogRef), 725);
  }

  onPerformConfirmForwardTicket(ref: MatDialogRef<MessageBoxDialog>) {
    // ref.close();
    // const dialogRef = this.showMessageBox(false,true,'Ticket has been forwarded.');
    // dialogRef.afterClosed().subscribe((result: any)=>{
    //   this.dialogRef.close();
    // });
    rest.post('head/ticket/forward', this.data).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been forwarded.');
        dialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close(this.data);
        })
        return;
      }
      ref.close();
      alert('Failed');
    }, (err: any) => {
      ref.close();
      alert('System Error!');
    });
  }

  showMessageBox(type: string, ticketNo: any, message: any): any {
    return this.dialog.open(MessageBoxDialog, {
      disableClose: true,
      width: type !== 'progress' ? '20%' : 'auto',
      data: { Type: type, Message: message, ticketNo: ticketNo }
    });
  }
}
