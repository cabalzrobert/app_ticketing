import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { rest } from '../../+services/services';
import { NewTicketDialogComponent } from './modal/new-ticket-dialog/new-ticket-dialog.component';
import moment from 'moment';

export interface DialogData {
  isProgress: boolean,
  isMessage: boolean,
  message: string
}

@Component({
  selector: 'app-communicator-ticket',
  templateUrl: './communicator-ticket.component.html',
  styleUrl: './communicator-ticket.component.scss'
})
export class CommunicatorTicketComponent {
  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog) { }
  @ViewChild('stepper') stepper!: MatStepper;

  height = 'height: calc(100% - 100px)';
  isTicketContentShow = false;
  collections: any = [];
  ticketTitle = '';
  ticketDetail: any;
  // categories = [
  //   {
  //     id: '0001',
  //     name: 'Category 1'
  //   },
  //   {
  //     id: '0002',
  //     name: 'Category 2'
  //   },
  //   {
  //     id: '0003',
  //     name: 'Category 3'
  //   },
  //   {
  //     id: '0004',
  //     name: 'Category 4'
  //   }
  // ];
  departments: any = [];
  tab = 0;
  messageHandler: any = [];

  ngOnInit() {
    // alert('Yeeee');
    this.onTabChange(0);
  }

  onTabChange(val: any) {
    this.tab = val;
    rest.post(`communicator/tickets?tab=${val}`).subscribe((res: any) => {
      if (res != null) {
        console.log(res);
        this.collections = res;
        this.collections.forEach((e: any) => {
          // e.dateCreated = moment(e.dateCreated).format('DD MMM yyyy');
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




  next(item: any) {
    // if(item.departmentId) return;
    this.router.navigate([item.ticketNo], { relativeTo: this.route });
    // this.router.navigateByUrl('/head/dashboard/tickets/sample');
    this.ticketTitle = item.title;
    this.ticketDetail = item;
    this.stepper.next();
    if(!item.departmentId)
      setTimeout(() => this.getDepartmentList());
    else if(item.isAssigned)
      setTimeout(()=>this.performGetTicketComments());
    else return;
}

  performGetTicketComments = async () => {
    rest.post(`communicator/ticket/comments?transactionNo=${this.ticketDetail.transactionNo}`,{}).subscribe((res: any) => {
      if (res) {
        // this.messageHandler = [...this.messageHandler,res];
        this.ticketDetail.messageHandler = res;
        console.log(this.ticketDetail);
        return
      }
      alert('Failed');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  goBack() {
    // this.router.navigate(['../tickets'], {relativeTo: this.route});
    this.router.navigate(['../tickets'], { relativeTo: this.route });
    // location.assign(this.router.url);
    this.stepper.reset();
    this.departments = [];
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

  selectedDepartment(item: any) {
    this.ticketDetail.assignedDepartment = item.DepartmentID;
  }

  spinner = false;

  onForwardTicket() {
    if(!this.ticketDetail.assignedDepartment) return;
    const dialogRef = this.showMessageBox(true, false,null);
    this.ticketDetail.status = 2;
    setTimeout(() => this.onSubmitForwardTicket(dialogRef), 725);
  }

  onSubmitForwardTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post('communicator/ticket/forward',this.ticketDetail).subscribe((res:any)=>{
      if(res.Status === 'ok'){
        ref.close();
        const dialogRef = this.showMessageBox(false,true,'Ticket has been forwarded');
        dialogRef.afterClosed().subscribe(() => {
          this.goBack();
          this.onTabChange(this.tab);
        })
        return;
      }
      alert('Failed');
      ref.close()
    },(err: any)=>{
      alert('System Error!');
      ref.close();
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


@Component({
  selector: 'app-message-box-dialog',
  templateUrl: 'modal/message-box-dialog.html',
  styleUrl: 'modal/message-box-dialog.scss',
})
export class MessageBoxDialog {

  constructor(private dialogRef: MatDialogRef<CommunicatorTicketComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
