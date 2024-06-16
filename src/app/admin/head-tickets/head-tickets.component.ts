import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { NewTicketDialogComponent } from './modal/new-ticket-dialog/new-ticket-dialog.component';
import { rest } from '../../+services/services';
import { tick } from '@angular/core/testing';
import moment from 'moment';
import { LocalStorageService } from '../../tools/plugins/localstorage';
import { Observable, empty } from 'rxjs';
import { jUser } from '../../+app/user-module';
import { stomp } from '../../+services/stomp.service';
import { timeout } from '../../tools/plugins/delay';
import { device } from '../../tools/plugins/device';

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

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private ls: LocalStorageService) {
    this.userDetail = ls.getItem1('UserAccount');
  }
  @ViewChild('stepper') stepper!: MatStepper;

  height = 'height: calc(100% - 100px)';
  isTicketContentShow = false;
  collections: any = [];
  collectionreceived: any = [];
  backupCollections: any = [];
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
  userId = '';
  userDetail: any = {};
  searchValue: any;

  tab = 0;
  ticketlistcount: any = {};
  unassigend: number = 0;
  assigned: number = 0;
  alltickets: number = 0;
  subs: any = {};
  prop: any = {};

  async ngOnInit() {

    this.userDetail = await jUser();
    this.onTabChange(0);
    //this.getDepartmentTicketCount();
    device.ready(() => this.stompWebsocketReceiver());
  }



  private async stompWebsocketReceiver() {
    //this.webSocketService.connect();
    //this.input = await jUser();
    var iscom = (this.userDetail.isCommunicator == true) ? 1 : 0;
    var isdept = (this.userDetail.isDeptartmentHead == true) ? 1 : 0;
    this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
    this.subs.wsDisconnect = stomp.subscribe('#disconnect', () => this.disconnect());
    this.subs.ws1 = stomp.subscribe(`/forwardticket/depthead/${isdept}`, (json: any) => this.receivedForwardedTicket(json));
    //console.log('Communicator Component', iscom);
    stomp.ready(() => (stomp.refresh(), stomp.connect()));
  }
  collectionListDetails(item: any) {
    return item;
  }
  receivedForwardedTicket(data: any) {
    var content = data.content;
    console.log('Department Head Page', data.content);
    let ticketexist = this.collections.find((o: any) => o.ticketNo == data.ticketNo);
    if (ticketexist) return;

    this.collections.forEach((o: any) => {
      this.collectionreceived.push(this.collectionListDetails(o));
    });
    this.collections = [];
    this.collectionreceived.unshift(data.content);

    this.collectionreceived.forEach((o: any) => {
      this.collections.push(this.collectionListDetails(o));
    })
    this.collectionreceived = [];
    return this.collections;
  }

  receiveTicket(item: any): Observable<any> {
    return this.collections;
  }
  private async refreshData() {
    //jUserModify();
    this.userDetail = await jUser();
  }
  private error() {
    this.ping(() => this.testPing());
  }
  private ReceivedTest(data: any) {
    //console.log('Received Test', data);
  }
  private disconnect() {
    this.stopPing();
  }
  private testPing() {
    const { subs } = this;
    this.stopPing();
    this.ping(() => subs.tmPing = timeout(() => this.testPing(), (60000 * 1)));
  }

  private ping(callback: Function) {
    const { prop, subs } = this;
    this.stopPing();
    this.subs.ping = rest.post('ping', {}).subscribe(async (res: any) => {
      if (res.Status == 'error') {
        if (res.Type == 'device.session-end') {
          if (!!prop.IsSessionEnd) return;
        }
      }
      if (!stomp.IsConnected)
        return;
      return callback();
    }, (err: any) => {
      if (!stomp.IsConnected)
        return;
      return callback();
    });
  }
  private connected() {
    this.ping(() => this.testPing());
  }
  private stopPing() {
    const { subs } = this;
    const { tmPing, ping } = subs;
    if (tmPing) tmPing.unsubscribe();
    if (ping) ping.unsubscribe();
  }

  getDepartmentTicketCount(): Observable<any> {
    rest.post(`head/ticket/count?departmentID=${this.userDetail.DEPT_ID}`).subscribe((res: any) => {
      if (res.Status == 'ok') {
        this.ticketlistcount = res.TicketCount;
        this.unassigend = res.TicketCount.Unassigned;
        this.assigned = res.TicketCount.Assigned;
        this.alltickets = res.TicketCount.AllTickets;
      }
      console.log('Department Head Forwarded Ticket Count', this.ticketlistcount, this.unassigend, this.assigned, this.alltickets);
      return this.ticketlistcount;
    }, (err: any) => {
      alert('System Error');
    });
    console.log('Department Head Forwarded Ticket Count', this.ticketlistcount, this.unassigend, this.assigned, this.alltickets);
    return this.ticketlistcount;
  }

  onTabChange(val: any) {
    this.searchValue = null;
    this.tab = val;
    console.log('onTabChange this.userDetail', this.userDetail);
    rest.post(`head/tickets?id=${this.userDetail.DEPT_ID}&tab=${val}`).subscribe((res: any) => {
      if (res != null) {
        console.log(res);
        this.collections = res;
        this.backupCollections = res;
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

  dateFormatted(isList: boolean, date: any) {
    if (isList) {
      const formattedDate = moment(date).format('D MMM');
      let splitDate = formattedDate.split(' ');
      if (splitDate[0] === '1' || splitDate[0] === '21' || splitDate[0] === '31')
        splitDate[0] = splitDate[0] + 'st';
      else if (splitDate[0] === '2' || splitDate[0] === '22')
        splitDate[0] = splitDate[0] + 'nd';
      else if (splitDate[0] === '3' || splitDate[0] === '23')
        splitDate[0] = splitDate[0] + 'rd';
      else
        splitDate[0] = splitDate[0] + 'th';

      return `${splitDate[0]} ${splitDate[1]}`;
    }
    else {
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
    if (!item.isAssigned)
      setTimeout(() => this.getDepartmentPersonnels());
  }

  goBack() {
    // this.router.navigate(['../tickets'], {relativeTo: this.route});
    this.router.navigate(['../assignedticket'], { relativeTo: this.route });
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
        this.ticketDetail.isForwarded = true;
      }
    });
  }

  onResolvingTicket() {
    const dialogRef = this.showMessageBox('confirmation', this.ticketDetail.ticketNo, null);
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

  searchTicket(val: string) {
    this.collections = this.backupCollections;
    this.collections = this.collections.filter((i: any) => i.title.includes(val));
    console.log(this.collections);
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
  selector: 'app-message-box-dialog',
  templateUrl: 'modal/message-box-dialog.html',
  styleUrl: 'modal/message-box-dialog.scss',
})
export class MessageBoxDialog {

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<HeadTicketsComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  confirm() {
    const dialogRef = this.showMessageBox('progress', null, null);
    setTimeout(() => this.onPerformResolveTicket(dialogRef), 725);
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
