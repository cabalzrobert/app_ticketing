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

//import { Observable, empty } from 'rxjs';
//import { jUser } from '../../+app/user-module';
import { stomp } from '../../+services/stomp.service';
import { timeout } from '../../tools/plugins/delay';
import { device } from '../../tools/plugins/device';

import { AsyncSubject, BehaviorSubject, Observable, Subject, empty, filter, takeUntil, timer } from 'rxjs';
import { jUser } from '../../+app/user-module';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TicketProgressModalComponent } from '../modalpage/ticket-progress-modal/ticket-progress-modal.component';
import { ViewAttachImageModalComponent } from '../modalpage/view-attach-image-modal/view-attach-image-modal.component';
import { stringify } from 'node:querystring';
const batchDone = new Subject<boolean>();
const timerDone = new Subject<boolean>();


export interface DialogData {
  Type: string,
  Message: string,
  TicketDetail: any,
  IsCancel: boolean,
  IsForward: boolean
}



@Component({
  selector: 'app-head-tickets',
  templateUrl: './head-tickets.component.html',
  styleUrl: './head-tickets.component.scss'
})
export class HeadTicketsComponent {

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private ls: LocalStorageService, private authService: AuthService) {
    this.userDetail = ls.getItem1('UserAccount');
  }
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;

  loader = true;
  height = 'height: calc(100% - 100px)';
  isTicketContentShow = false;
  batch = 0;
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
  showProgress = false;

  _collections = Observable<any[]>;

  tab = 0;
  ticketlistcount: any = {};
  unassigend: number = 0;
  assigned: number = 0;
  alltickets: number = 0;
  subs: any = {};
  prop: any = {};

  async ngOnInit() {


    this.userDetail = await jUser();
    console.log('account', this.userDetail);

    // this.onTabChange(0);
    //this.getDepartmentTicketCount();
    device.ready(() => this.stompWebsocketReceiver());
    if (Object.keys(this.authService.requesttickect).length > 0) {
      console.log('nisulod', this.authService.requesttickect);
      //  this.nextBatch({tab:0, search:this.authService.requesttickect.Description, IsReset: false})
      console.log('nisulod', this.authService.requesttickect.IsAssigned);
      this.tab = 0
      if (this.authService.requesttickect.IsAssigned)
        this.tab = 1
      else
        this.tab = 0
      console.log('nisulod', this.authService.requesttickect.IsAssigned);
      this.searchTicket(this.authService.requesttickect.TransactionNo);
    }
  }

  IsMobile(): boolean{
    if(window.innerWidth <= 767)
      return true;
    return false;
  }

  isSideToggle = false;
  sideToggle(){
    this.isSideToggle = !this.isSideToggle;
    console.log('side toggle',this.isSideToggle);
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


    this.subs.ws1 = stomp.subscribe(`/requestorhead`, (json: any) => this.receivedRequestTicketCommunicator(json));

    this.subs.ws1 = stomp.subscribe(`/comment`, (json: any) => this.receivedComment(json));
    this.subs.ws1 = stomp.subscribe('/' + iscom + '/ticketrequest/iscommunicator', (json: any) => this.receivedRequestTicketCommunicator(json));


    this.subs.ws1 = stomp.subscribe('/test/notify', (json: any) => this.receivedNotify(json));

    //console.log('Communicator Component', iscom);
    stomp.ready(() => (stomp.refresh(), stomp.connect()));
  }
  collectionListDetails(item: any) {
    return item;
  }
  overviewnotification: any = {
    "type": "requestorhead-notification",
    "content": {
      "requestId": "00020010000008",
      "requestName": "Kabungkagon, Tessie S.",
      "requestUsername": "",
      "transactionNo": "0000000103",
      "ticketNo": "7E63F86",
      "categoryId": "",
      "categoryName": "",
      "title": "Sample Ticket 202407310826",
      "description": "Sample Ticket 202407310826",
      "priorityLevel": "0",
      "priorityName": "Low",
      "forwardDepartmentId": "",
      "forwardDepartmentName": "",
      "assignedId": "",
      "assignedName": "",
      "departmentId": "00101",
      "departmentName": "Accounting",
      "isAssigned": "False",
      "assignedUsername": "",
      "forwardToId": "",
      "forwardToName": "",
      "forwardRemarks": "",
      "isForwarded": "False",
      "status": "0",
      "ticketStatus": "Open",
      "dateCreated": "07/31/2024 8:26:55 AM"
    },
    "notification": {
      "NotificationID": "161",
      "DateTransaction": "07/31/2024 8:26:55 AM",
      "TransactionNo": "0000000103",
      "Title": "Kabungkagon, Tessie S.send Ticket with Transaction No.:0000000103",
      "Description": "Sample Ticket 202407310826",
      "IsOpen": false,
      "IsRequest": true,
      "Type": "Ticket-Request",
      "DateDisplay": "Jul 31, 2024",
      "TimeDisplay": "08:26:55 AM",
      "FulldateDisplay": "Jul 31, 2024 08:26:55 AM"
    }
  };
  notificationid: number = 161;
  HAdd() {
    this.notificationid = this.notificationid + 1;
    this.overviewnotification.content.ticketNo = this.notificationid
    this.receivedRequestTicketCommunicator(this.overviewnotification);
  }
  private async receivedNotify(data: any) {
    //this.HAdd();
    console.log('Test Notify', data);
  }

  receivedComment(data: any) {
    var content = data.content;
    var transaction = data.transactionno;
    if (transaction == this.TransactionNo) {
      console.log('Received Comment Content', content);
      this.ticketcomment.push(content);
    }

  }
  receivedRequestTicketCommunicator(data: any) {


    var content = data.content;
    //this.TicketNo = content.TicketNo;
    console.log('Requestor Department Head Page', data.content);
    //this.collections.push(data.content);
    //let ticketexist = this.collections.find((o: any) => o.ticketNo == data.ticketNo);
    //let ticketexist = this.collections.find((o: any) => o.ticketNo == data.ticketNo);
    let ticketexist: any = this.collections.find((o: any) => o.ticketNo == data.content.ticketNo);
    if (ticketexist) return;

    this.collectionreceived = this.collections;
    this.collections = [];

    this.collectionreceived.unshift(data.content);
    this.collections = this.collections.concat(this.collectionreceived);
    this.collectionreceived = [];
    return this.collections;

    /*
    this.collections.forEach((o: any) => {
      this.collectionreceived.push(this.collectionListDetails(o));
    });
    this.collections = [];
    this.collectionreceived.unshift(data.content);

    //this.collections = this.collectionreceived.map((o: any) => this.collectionListDetails(o));
    this.collectionreceived.forEach((o: any) => {
      this.collections.push(this.collectionListDetails(o));
    })
    this.collectionreceived = [];
    return this.collections;
    */

    //this.collections.unshift(data.content);

    //console.log('this.collection Websocket', this.collections);
    // if (this.input.LastTransactionNo == content.TransactionNo) return;

    // //console.log('this.TicketNo 299', content.TransactionNo);
    // bindLastTransacationNumber(content.TransactionNo);
    // additionalNotification(1);
    // this.refreshData();
    // return this.input.NotificationCount;
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
  logNotify() {
    rest.post('ticket/test/notify').subscribe(async (res: any) => {
      //console.log('logNotify res', res);
      //additionalNotification(1);
    });
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

  nameSplitter(val: any) {
    let name = '';
    if (!val) name = this.ticketDetail?.categoryName.split('(')[0];
    else name = val;

    return name;
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

    // this.onTabChange(0);
    // console.log('viewport',this.virtualScroll.getRenderedRange().end);

  }


  // onTabChange(val: any) {
  //   this.searchValue = null;
  //   this.tab = val;

  //   console.log('onTabChange this.userDetail', this.userDetail);

  //   rest.post(`head/tickets?id=${this.userDetail.DEPT_ID}&tab=${val}`).subscribe((res: any) => {
  //     if (res != null) {
  //       console.log(res);
  //       this.collections = res;
  //       this.backupCollections = res;
  //       // this.collections.forEach((e: any) => {
  //       //   e.dateCreated = moment(e.dateCreated).format('DD MMM yyyy');
  //       // });
  //       return;
  //     }
  //     alert('Failed');
  //   }, (err: any) => {
  //     alert('System Error');
  //   })

  onTabChange(val: any) {
    this.searchValue = null;
    this.tab = val;

    console.log('onTabChange this.userDetail', this.userDetail);
    rest.post(`head/tickets?id=${this.userDetail.DEPT_ID}&tab=${val}`).subscribe((res: any) => { this.loader = false; });

    // rest.post(`head/tickets?id=${this.userDetail.DEPT_ID}&tab=${val}`).subscribe((res: any) => {
    //   if (res != null) {
    //     console.log(res);
    //     this.collections = res;
    //     this.backupCollections = res;
    //     // this.collections.forEach((e: any) => {
    //     //   e.dateCreated = moment(e.dateCreated).format('DD MMM yyyy');
    //     // });
    //     return;
    //   }
    //   alert('Failed');
    // }, (err: any) => {
    //   alert('System Error');
    // })


  }

  async nextBatch(val: any) {
    this.loader = false;
    console.log('tab', val.tab);
    console.log(`new batch ${val.tab}`);
    console.log(`tab ${this.tab} = val.tab ${val.tab}`);
    let end = 0;
    let total = 0;
    if (this.tab !== val.tab) {
      this.collections = [];
    } else {
      end = this.virtualScroll.getRenderedRange().end;
      total = this.collections.length;
    }
    // if(val.tab===undefined) val.tab = this.tab;
    // if (!this.subs) return this.collections;
    // if (this.subs.s1) this.subs.s1.unsubscribe();
    // console.log('val.IsReset', val.IsReset);
    // console.log('this.subs.s1', this.subs.s1);
    // console.log(`total communicator next batch`);
    const filter = { tab: val.tab, departmentId: this.userDetail.DEPT_ID, row: total, search: this.searchValue };
    this.tab = val.tab;
    console.log(`end ${end} <= total ${total} : batch ${this.batch}`);
    if (end === total) {
      this.loader = true;
      console.log(filter);
      this.showProgress = true;
      await this.onPerformGetTickets(filter, this.tab);
    }

    // if(this.tab !== tab)
    //   this.batch = 0;
    // const end = this.virtualScroll.getRenderedRange().end;
    // const total = this.virtualScroll.getDataLength();
    // const filter = {tab: this.tab, departmentId: this.userDetail.DEPT_ID, row: total, search: this.searchValue};
    // console.log(`${end} <= ${total}`);
    // if(end === total){
    //   console.log(filter);
    //   rest.post('head/tickets?',filter).subscribe((res: any) => {
    //     if (res != null) {
    //       console.log('onTabChange result', res);
    //       if(res.length > 0)
    //         this.collections = this.collections.concat(res);
    //       console.log('collections batch = ',this.collections.length,this.collections);
    //       return;
    //     }
    //     alert('Failed');
    //   }, (err: any) => {
    //     alert('System Error');
    //   })
    // }
  }

  async onPerformGetTickets(filter: any, tab: any) {
    rest.post('head/tickets', filter).pipe(takeUntil(batchDone)).subscribe((res: any) => {

      if (res != null) {
        this.showProgress = false;
        batchDone.next(true);
        console.log('onTabChange result', res);
        // if (!val.IsReset || res.length < 1) this.collections = res.map((o: any) => this.collectionListDetails(o));
        // else res.forEach((o: any) => this.collections.push(this.collectionListDetails(o)));

        // return this.collections;
        if (res.length > 0)
          this.collections = this.collections.concat(res);
        this.backupCollections = this.collections;
        console.log('collections batch = ', this.batch, this.collections);
        this.loader = false;
        this.loader = false;
        return;
      }
      else {
        this.loader = false;
        alert('Failed');
      }

    }, (err: any) => {
      alert('System Error');
    })
  }

  dateFormatted(isList: boolean, date: any) {
    if (isList) {
      const formattedDate = moment(date).format('MMM D yyyy hh:mm A');
      let splitDate = formattedDate.split(' ');
      if (splitDate[1] === '1' || splitDate[1] === '21' || splitDate[1] === '31')
        splitDate[1] = splitDate[1] + 'st';
      else if (splitDate[1] === '2' || splitDate[1] === '22')
        splitDate[1] = splitDate[1] + 'nd';
      else if (splitDate[1] === '3' || splitDate[1] === '23')
        splitDate[1] = splitDate[1] + 'rd';
      else
        splitDate[1] = splitDate[1] + 'th';

      // console.log(new Date(date).getFullYear(),'=',new Date().getFullYear());
      if (new Date(date).getFullYear() !== new Date().getFullYear())
        return `${splitDate[1]} ${splitDate[0]}, ${splitDate[2]}`;
      return `${splitDate[1]} ${splitDate[0]} ${splitDate[3]} ${splitDate[4]}`;
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
        console.log(res.personnels)
        this.personnels = res.personnels;
        this.personnels = this.personnels.filter((res: any) => res.userId !== this.ticketDetail?.requestId);
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }
  _hour: number = 0;
  _minute: number = 0;
  _second: number = 0;
  _elapsedtime: string = '';
  interval: any;

  next(item: any) {
    // if(item.isAssigned) return;
    console.log('View Ticket at Department Head Requestor');

    let elapsedtime: any = (item.elapsedTime).split(" ", 3);
    let _h: string = (elapsedtime[0]).replace('h', '');
    let _m: string = (elapsedtime[1]).replace('m', '');
    let _s: string = elapsedtime[2];

    this._hour = parseInt(_h);
    this._minute = parseInt(_m);
    this._second = parseInt(_s);


    this.router.navigate([item.ticketNo], { relativeTo: this.route });
    // this.router.navigateByUrl('/head/dashboard/tickets/sample');
    this.ticketTitle = item.title;
    this.ticketDetail = item;
    this.TransactionNo = item.transactionNo;
    //console.log('next',this.ticketDetail);
    this.stepper.next();
    this.getCommentList(this.ticketDetail.transactionNo);
    if (item.ticketStatus != 'Closed' && item.ticketStatus != 'Cancel')
      this.getLElapsedTime1();
    else
      clearInterval(this.interval);
    this.scrollToBottom();
    // if (!item.isAssigned)
    //   setTimeout(() => this.getDepartmentPersonnels());

  }

  elapsedTimeStart1() {
    timer(1000, 1000)
      .pipe(takeUntil(timerDone))
      .subscribe({
        next: () => {
          this.getLElapsedTime1();
        },
        complete: () => {
          this.getLElapsedTime1();
        },
      });
  }

  getLElapsedTime1() {
    const dateCreated = new Date(this.ticketDetail.dateCreated);
    const today = new Date();
    const hours = this._hour;
    const minutes = this._minute;
    const seconds = this._second;
    let elapsedTime = '';
    this.interval = setInterval(() => this.startTime(), 1000);
  }
  startTime() {
    this._second = this._second + 1;
    if (this._second == 60) {
      this._minute = this._minute + 1;
      this._second = 0;
    }
    if (this._minute == 60) {
      this._hour = this._hour + 1;
      this._minute = 0;
      this._second = 0;
    }
    let _h:string = ((this._hour).toString().length == 1) ? `0${this._hour}` : (this._hour).toString();
    let _m:string = ((this._minute).toString().length == 1) ? `0${this._minute}` : (this._minute).toString();
    let _s:string = ((this._second).toString().length == 1) ? `0${this._second}` : (this._second).toString();
    this._elapsedtime = `${_h}h ${_m}m ${_s}s`;
    this.ticketDetail.elapsedTime = this._elapsedtime;
  }

  elapsedTimeStart() {
    timer(1000, 1000)
      .pipe(takeUntil(timerDone))
      .subscribe({
        next: () => {
          this.getLElapsedTime();
        },
        complete: () => {
          this.performUpdateElapsedTime();
        },
      });
  }

  getLElapsedTime() {
    const dateCreated = new Date(this.ticketDetail.dateCreated);
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    let elapsedTime = '';
    if (hours >= 8 && hours <= 17) {
      if (dateCreated.getMonth() === today.getMonth() && dateCreated.getDate() === today.getDate()) {
        const time = (today.getTime() - dateCreated.getTime())
        const hours = time / 1000 / 3600;
        const minutes = (hours % 1) * 60;
        const seconds = (minutes % 1) * 60;
        this.ticketDetail.elapsedTime = time;
        elapsedTime = Math.floor(hours) + 'h ' + Math.floor(minutes) + 'm ' + String(Math.floor(seconds)).padStart(2, '0') + 's';
      }
      else {
        const date = moment(today).format('yyyy-MM-DD') + ' 8:00:00';
        const workStartDate = new Date(date);
        const time = (today.getTime() - workStartDate.getTime()) + (this.ticketDetail?.elapsedTime ?? 0);
        const hours = time / 1000 / 3600;
        const minutes = (hours % 1) * 60;
        const seconds = (minutes % 1) * 60;
        this.ticketDetail.timeElapses = time;
        elapsedTime = Math.floor(hours) + 'h ' + Math.floor(minutes) + 'm ' + String(Math.floor(seconds)).padStart(2, '0') + 's';
      }

      if (hours === 17) {
        timerDone.next(true);
      }
    }
    // console.log('Elapsed Time: ',elapsedTime);
    this.ticketDetail.elapsedTimeString = elapsedTime;
  }

  performUpdateElapsedTime() {
    const param: any = {};
    param.ticketNo = this.ticketDetail.ticketNo;
    param.time = this.ticketDetail.timeElapses;
    rest.post('ticket/elapsedtime/update', param).subscribe((res: any) => {
      if (res.Status === 'ok') {
        console.log('success');
        return;
      }
      alert('failed')
    }, (error: any) => {
      alert('System Error!');
    });
  }

  goBack() {
    clearInterval(this.interval);
    // this.router.navigate(['../tickets'], {relativeTo: this.route});
    this.router.navigate(['../assignedticket'], { relativeTo: this.route });
    this.stepper.previous();
    this.personnels = [];
    this.collections = [];
    this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
    this.nextBatch({ tab: this.tab });
  }

  hViewAttachment() {
    if (!this.ticketDetail.attachment) return;
    console.log('hViewAttachments', this.ticketDetail);
    let viewattachment: any = [];
    viewattachment = JSON.parse(this.ticketDetail.attachment);
    let attachment: any = [];
    viewattachment.forEach((o: any) => attachment.push({ URL: o.base64 }));
    console.log('hViewAttachment URL 281', attachment);
    console.log('hViewAttachment URL 282', attachment[0]);
    this.ticketViewAttachment = this.dialog.open(ViewAttachImageModalComponent, { data: { item: attachment } });
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
    const dialogRef = this.showMessageBox('progress', null, null, false, false);
    setTimeout(() => this.onSubmitAssignTicket(dialogRef), 725);
  }

  onSubmitAssignTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post('head/ticket/assign', this.ticketDetail).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been assigned.', false, false);
        dialogRef.afterClosed().subscribe(() => {
          this.goBack();
          // this.collections = [];
          // this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
          // this.nextBatch(this.tab);
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
    if (this.ticketDetail.ticketStatusId === 4) {
      const dialogRef = this.showMessageBox('confirmation', null, 'This ticket is for resolve. Are you sure all requirements have been meet?', false, true);
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          const dialogRef = this.showMessageBox('progress', null, null, false, false);
          setTimeout(() => this.onSubmitReturnTicket(dialogRef), 725);
        }
      })
    }
  }

  onSubmitReturnTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post(`head/ticket/return?ticketNo=${this.ticketDetail.ticketNo}`, {}).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been returned.', false, false);
        dialogRef.afterClosed().subscribe(() => {
          this.goBack();
          // this.collections = [];
          // this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
          // this.nextBatch(this.tab);
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
    // if(this.ticketDetail?.isRequiredCommunicator&&this.ticketDetail.ticketStatusId===4){
    //   const dialogRef = this.dialog.open(ForwardDialog, {
    //     data: { TicketDetail: this.ticketDetail , IsRequiredOtherDepartment: true, Department: null }
    //   })

    //   dialogRef.afterClosed().subscribe((result: any) => {
    //     if (result) {
    //       console.log(result);
    //     }
    //   });
    // }
    // else
    // {
    //   const dialogRef = this.showMessageBox('confirmation', this.ticketDetail, 'Does it require other department?', false, true);
    //   dialogRef.afterClosed().subscribe((result: any) => {
    //     console.log('Forwarding Ticket',result);
    //       const dialogRef = this.dialog.open(ForwardDialog, {
    //         data: { TicketDetail: this.ticketDetail, IsRequiredOtherDepartment: result, Department: !result?this.userDetail.DEPT_ID:null }
    //       })

    //       dialogRef.afterClosed().subscribe((result: any) => {
    //         if (result) {
    //           console.log(result);
    //         }
    //       });
    //   });
    // }



    if (this.ticketDetail.ticketStatusId === 4) {
      const dialogRef = this.dialog.open(ForwardDialog, {
        data: { TicketDetail: this.ticketDetail, IsRequiredOtherDepartment: true, Department: null }
      })

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.goBack();
          // this.collections = [];
          // this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
          // this.nextBatch({tab: this.tab});
        }
      });
    }
    else {
      const dialogRef = this.showMessageBox('confirmation', this.ticketDetail, 'Does it require other department?', false, true);
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('Forwarding Ticket', result);
        if (!result && this.ticketDetail.ticketStatusId === 4) {

        }
        else {
          const dialogRef = this.dialog.open(ForwardDialog, {
            width: '416px',
            panelClass: 'mat-dialog-not-progress',
            data: { TicketDetail: this.ticketDetail, IsRequiredOtherDepartment: result, Department: !result ? this.userDetail.DEPT_ID : null }
          })

          dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
              if (result.status === 4) {
                this.ticketDetail.isAssigned = true;
                this.ticketDetail.assignedId = result.assignedTo;
                this.ticketDetail.assignedName = result.assignedName;
              }
              else {
                this.goBack();
              }
            }
          });
        }
      });
    }


    // const dialogRef = this.showMessageBox('confirmation', this.ticketDetail, 'Does it require other department?', false, true);
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log('Forwarding Ticket',result);
    //   if(!result && this.ticketDetail.statu===4 && this.ticketDetail.ticketStatusId===4 && this.ticketDetail.isRequiredCommunicator){

    //   }
    //   else{
    //     const dialogRef = this.dialog.open(ForwardDialog, {
    //       data: { TicketDetail: this.ticketDetail, IsRequiredOtherDepartment: result, Department: !result?this.userDetail.DEPT_ID:null }
    //     })
    //     dialogRef.afterClosed().subscribe((result: any) => {
    //       if (result) {
    //         console.log(result);
    //       }
    //     });
    //   }
    // });


  }

  onPerformConfirmForwardTicket(ref: MatDialogRef<MessageBoxDialog>) {
    // ref.close();
    // const dialogRef = this.showMessageBox(false,true,'Ticket has been forwarded.');
    // dialogRef.afterClosed().subscribe((result: any)=>{
    //   this.dialogRef.close();
    // });
    const param: any = {};
    param.ticketNo = this.ticketDetail.ticketNo;
    param.forwardDepartment = this.ticketDetail.departmentId;
    param.status = 1;
    rest.post('head/ticket/forward', param).subscribe((res: any) => {
      ref.close();
      if (res.Status === 'ok') {
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been forwarded.', false, false);
        dialogRef.afterClosed().subscribe(() => {

        });
        return;
      }
      ref.close();
      alert('Failed');
    }, (err: any) => {
      ref.close();
      alert('System Error!');
    });
  }

  onResolvingTicket() {

    if (!this.ticketDetail.isRequiredCommunicator) {
      const dialogRef = this.showMessageBox('progress', null, null, false, false);
      setTimeout(() => this.onPerformResolveTicket(dialogRef), 725);
    }
    else {
      const dialogRef = this.showMessageBox('progress', null, null, false, false);
      setTimeout(() => this.onPerformHDResolveTicket(dialogRef), 725);
    }


    // if(!this.ticketDetail.isAssigned) {
    //   const dialogRef = this.showMessageBox('resolve', this.ticketDetail, 'Does it require other department?', false, false);
    //   dialogRef.afterClosed().subscribe((result: any) => {
    //     console.log('onResolving',result);
    //     if (!result) {
    //       this.ticketDetail.status = 3;
    //       this.ticketDetail.ticketStatusId = 3;
    //       this.ticketDetail.isAssigned = true;
    //       this.ticketDetail.assignedId = this.userDetail.USR_ID;
    //       this.ticketDetail.assignedName = this.userDetail.FLL_NM;
    //     }else
    //     {
    //       this.ticketDetail.status = 3;
    //       this.ticketDetail.ticketStatusId = 4;
    //       this.ticketDetail.isAssigned = true;
    //       this.ticketDetail.assignedId = this.userDetail.USR_ID;
    //       this.ticketDetail.assignedName = this.userDetail.FLL_NM;
    //     }
    //   })
    // }
    // else {
    //   const dialogRef = this.showMessageBox('confirmation', this.ticketDetail, 'You are about to resolve this ticket. Are you sure all requirements have been meet?', false, false);
    //   dialogRef.afterClosed().subscribe((result: any) => {
    //     console.log('onResolving',result);
    //     if (result) {
    //       if(this.ticketDetail.isAssigned){
    //         this.ticketDetail.status = 3;
    //         this.ticketDetail.ticketStatusId = 3;
    //       }
    //       else
    //       {
    //         this.ticketDetail.isDone = true;
    //       }
    //       // this.goBack();
    //       // this.onTabChange(this.tab);
    //     }
    //   })
    // }
  }

  onPerformResolveTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post(`head/ticket/resolve?ticketNo=${this.ticketDetail.ticketNo}`).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been resolved.', false, false);
        dialogRef.afterClosed().subscribe(() => {
          // this.dialogRef.close(true);
          this.ticketDetail.status = 3;
          this.ticketDetail.ticketStatusId = 3;
          this.ticketDetail.isAssigned = true;
          this.ticketDetail.assignedId = this.userDetail.USR_ID;
          this.ticketDetail.assignedName = this.userDetail.FLL_NM;
        });
        return;
      }
      alert('Failed');
      ref.close();
    }, (err: any) => {
      alert('System Error!');
      ref.close();
    })
  }

  onPerformHDResolveTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post(`head/ticket/hdresolve?ticketNo=${this.ticketDetail.ticketNo}`).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been resolved.', false, false);
        dialogRef.afterClosed().subscribe(() => {
          this.ticketDetail.status = 3;
          this.ticketDetail.ticketStatusId = 4;
          this.ticketDetail.isAssigned = true;
          this.ticketDetail.assignedId = this.userDetail.USR_ID;
          this.ticketDetail.assignedName = this.userDetail.FLL_NM;
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

  decline = async () => {
    // const dialogRef = this.showMessageBox('confirmation', this.ticketDetail, 'You are about to resolve this ticket. Are you sure all requirements have been meet?', false, false);
    rest.post(`head/ticket/cancel?ticketNo=${this.ticketDetail.ticketNo}`, {}).subscribe((res: any) => {
      if (res.Status === 'ok') {
        console.log(this.ticketDetail.status, this.ticketDetail.ticketStatusId);
        if (this.ticketDetail.status === 3 && this.ticketDetail.ticketStatusId === 3 && this.userDetail.USR_ID !== this.ticketDetail.assignedId) {
          this.ticketDetail.status = 4;
          this.ticketDetail.ticketStatusId = 4;
        }
        if (this.ticketDetail.status === 3 && this.ticketDetail.ticketStatusId === 3 && this.userDetail.USR_ID === this.ticketDetail.assignedId) {
          this.ticketDetail.status = 0;
          this.ticketDetail.ticketStatusId = 0;
          this.ticketDetail.isAssigned = false;
          this.ticketDetail.assignedName = null;
        }
        else
          this.ticketDetail.isDone = false;
        return;
      }
      alert('Failed');
    }, (err: any) => {
      alert('System Error!');
    });
  }

  onCancellingTicket() {
    const dialogRef = this.dialog.open(CancelDialog, {
      panelClass: 'mat-dialog-not-progress',
      width: '18%',
      data: this.ticketDetail
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.goBack();
        // this.collections = [];
        // this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
        // this.nextBatch({tab: this.tab});


        // this.ticketDetail.RFC = result.RFC;
        // const _dialogRef = this.showMessageBox('confirmation', this.ticketDetail, 'Are you sure you want to cancel this ticket?', true, false);
        // _dialogRef.afterClosed().subscribe((result: any) => {
        //   console.log(result);
        //   if (result) {
        //     this.goBack();
        //     this.collections = [];
        //     this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
        //     this.nextBatch({tab: this.tab});
        //   }
        // });
      }
    });

  }

  // cancel = async () => {
  //   rest.post(`head/ticket/dismiss?ticketNo=${this.ticketDetail.ticketNo}`, {}).subscribe((res: any) => {
  //     if (res.Status === 'ok') {
  //       this.ticketDetail.ticketStatus = 'Cancel';
  //       return;
  //     }
  //     alert('Failed');
  //   }, (err: any) => {
  //     alert('System Error!');
  //   });
  // }

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


  // searchTicket(val: string) {
  //   this.collections = this.backupCollections;
  //   this.collections = this.collections.filter((i: any) => i.title.includes(val));
  //   console.log(this.collections);
  // }
  searchTicket(val: string) {
    try {
      this.searchValue = !val ? null : val;
      this.collections = [];
      this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
      this.nextBatch({ tab: this.tab });
    } catch (error) {

    }
    // this.collections = this.backupCollections;
    // this.collections = this.collections.filter((i:any)=>i.title.includes(val));
    // console.log(this.collections);

  }

  isFilterAscending = false;
  filter(){
    const ascending: any = this.backupCollections;
    const descending: any = this.backupCollections;
    let _collections: any = []; 
    this.isFilterAscending = !this.isFilterAscending;
    if(this.isFilterAscending)
      _collections = [...descending].sort((a,b) => a.rowNum > b.rowNum ? -1: 1);
    else
      _collections = [...ascending].sort((a,b) => a.rowNum < b.rowNum ? -1 : 1);
    this.collections = [..._collections];
    console.log(this.collections,this.backupCollections);
  }

  showMessageBox(type: string, ticketDetail: any, message: any, isCancel: boolean, isForward: boolean): any {
    return this.dialog.open(MessageBoxDialog, {
      panelClass: type === 'progress' || type === 'message' ? 'mat-dialog-progress' : 'mat-dialog-not-progress',
      disableClose: true,
      width: type === 'progress' ? 'auto' : type === 'message' ? '320px' : '290px',
      data: { Type: type, Message: message, TicketDetail: ticketDetail, IsCancel: isCancel, IsForward: isForward, IsSuccess: true }
    });
  }



  public tabsContentRefComment!: ElementRef;
  resolveticketDialogRef?: MatDialogRef<TicketProgressModalComponent>;
  ticketViewAttachment?: MatDialogRef<ViewAttachImageModalComponent>;

  ticketcomment: any = [];
  ticketcommentAttacheImage: any = [];
  ticketImageAttachment: any = [];
  resolveEvents: number = 0;
  ticketindex: number = 0;

  pending: string = '';
  resolve: string = '';
  allticket: string = '';
  ticketcount: any = [];
  ticketpending: any = [];


  base64 = '';
  attahcment: any = [];
  input1: any = {};
  files: any = {};
  selectedFiles: any[] = [];
  selectedFiles1: any[] = [];
  uploaded: any = [];
  viewRequestorPage: boolean = false;
  viewTicketComment: boolean = true;
  tickettitle: string = '';
  TicketDescription: string = '';
  TransactionNo: String = ''
  TicketNo: String = '';
  CreatedDate: String = '';
  TicketStatus: Number = 0;
  Status: Number = 0;
  TicketStatusname: String = '';
  PriorityLevelname: String = '';
  isAssigned: boolean = false;
  AssignedAccount: String = '';
  AssignedAccountname: String = '';
  LastMessage: String = '';
  DepartmenName: String = '';
  DepartmentID: String = ''
  AssignedAccountEmail: String = ''
  AssignedAccountProfilePicture: String = ''
  ticketupdate: any = {};
  public commentform = new FormGroup({
    Message: new FormControl(),
    FileAttachment: new FormControl()
  })

  getCommentList(TransactionNo: String): Observable<any> {
    rest.post('ticket/commentlist?TransactionNo=' + TransactionNo).subscribe(async (res: any) => {
      this.ticketcomment = res.Comment;
      let last = this.ticketcomment[parseInt(this.ticketcomment.length) - 1];
      //moment(date).format('DD MMM yyyy')
      console.log('let last message', moment(last.CommentDate).format('DD MMM yyyy'));
      console.log('let last message', last);
      this.LastMessage = last.CommentDate;
      //await this.getlastMessage(moment(last.CommentDate).format('DD MMM yyyy'));
      return this.ticketcomment;
    });
    return this.ticketcomment;
  }

  hSendComment() {
    console.log('hSendComment', this.commentform.controls["Message"].value);
    if (!this.commentform.value.Message) {
      alert('Invalid Message')
      return;
    }
    //console.log('hSendComment', this.TransactionNo);
    this.performSendComment({ TransactionNo: this.TransactionNo, Message: this.commentform.controls["Message"].value, isImage: false, isFile: false, isRead: false, isMessage: true, FileAttachment: this.commentform.value.FileAttachment });
    this.commentform.reset();
  }

  performSendComment(item: any) {
    console.log('performSendComment item', item.FileAttachment);
    rest.post('ticket/msg/send', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        //res.Content.forEach((o:any) => this.ticketImageAttachment.push(this.ticketCommentListDetails(0)));
        this.ticketcomment.push(this.ticketCommentListDetails(res.Content));
        //console.log('performSendComment', this.ticketcomment);
        return this.ticketcomment
      }
      else {
        alert(res.Message);
      }
    });
  }

  ticketCommentListDetails(item: any) {
    console.log('ticketCommentListDetails', item);
    return ({ Branch_ID: item.Branch_ID, CommentDate: item.CommentDate, CommentID: item.CommentID, Company_ID: item.Company_ID, Department: '', DisplayName: item.DisplayName, FileAttachment: item.FileAttachment, ImageAttachment: item.ImageAttachment, IsYou: true, Message: item.Message, ProfilePicture: item.ProfilePicture, SenderID: item.SenderID, TransactionNo: item.TransactionNo, isFile: item.isFile, isImage: item.isImage, isMessage: item.isMessage, isRead: false })
  }

  async onFileSelected(event: any, input: HTMLInputElement) {
    //this.ticketcomment = [];
    //return this.ticketcomment;

    await this.onFileSelectedComment(event, input);
    //console.log('onFileSelect 70', this.ticketcomment);
    this.ticketcomment.forEach((o: any) => this.ticketcommentAttacheImage.push(o));

    //console.log('onFileSelect 70', this.ticketcommentAttacheImage);
    //this.ticketcomment = [];
    device.ready(() => setTimeout(() => this.performSendCommentImage(this.input1), 275));
    //this.ticketcomment = [];
    //this.ticketcommentAttacheImage.forEach((o:any) => this.ticketcomment.push(o));

    this.commentform.reset();
    this.scrollToBottom();
    return this.ticketcomment;
  }

  scrollToBottom() {
    const el: HTMLDivElement = this.tabsContentRefComment.nativeElement;
    el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
  }

  performSendCommentImage(item: any) {
    console.log('performSendComment item', item.FileAttachment);
    rest.post('ticket/msg/send', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        //res.Content.forEach((o:any) => this.ticketImageAttachment.push(this.ticketCommentListDetails(0)));

        //this.ticketcommentAttacheImage.unshift( this.ticketCommentListDetails(res.Content));
        //batchDone.next(true);
        this.ticketcommentAttacheImage.push(this.ticketCommentListDetails(res.Content));
        this.ticketcommentAttacheImage.forEach((o: any) => this.ticketcomment.push(setTimeout(() => this.ticketCommentListDetails(o), 275)));

        //console.log('performSendCommentImage this.ticketImageAttachment 1848', this.ticketcommentAttacheImage);
        //this.ticketcomment = [];
        //this.ticketcommentAttacheImage.forEach((o:any) => this.ticketcomment.push(o));
        //console.log('performSendCommentImage this.ticketImageAttachment 1854', this.ticketcomment);
        //console.log('performSendComment', this.ticketcomment);
        console.log('performSendComment 1864', this.ticketcomment);
        //this.ticketcomment = this.ticketcomment.concat(this.ticketcommentAttacheImage);
        this.ticketcomment = this.ticketcommentAttacheImage;
        console.log('performSendComment 1864', this.ticketcomment);

        return this.ticketcomment;
      }
      else {
        alert(res.Message);
      }
    });
  }

  onFileSelectedComment(event: any, input: HTMLInputElement): Promise<Observable<any>> {
    this.uploaded = [];
    this.selectedFiles = [];
    this.selectedFiles1 = [];
    const result = new AsyncSubject<any[]>();
    var cntupload = this.uploaded.length + event.target.files.length;
    if (cntupload > 5) {
      event.preventDefault();
      event.value = "";
      return event.value;
    }
    let files = [].slice.call(event.target.files);
    this.files = files;
    this.onFileSelected1(files);
    if (this.selectedFiles1) {
      this.uploaded = this.selectedFiles1;
    }

    const file: File = event.dataTransfer?.files[0] || event.target?.files[0];
    event.value = '';
    this.input1.TransactionNo = this.TransactionNo;
    this.input1.Message = this.commentform.controls["Message"].value;
    this.input1.isImage = true;
    this.input1.isFile = false;
    this.input1.isMessage = false;
    this.input1.FileAttachment = this.base64;
    console.log('tthis.uploaded 99', this.selectedFiles1.length);
    console.log('this.input1 38', this.input1);
    return this.uploaded
  }

  public onFileSelected1(files: File[]): Observable<any[]> {
    // this.selectedFiles = []; // clear
    console.log('onFileSelect1 files', files.length);
    const result = new AsyncSubject<any[]>();
    this.toFilesBase64(files, this.selectedFiles).subscribe((res: any[]) => {
      res.forEach((i: any) => this.selectedFiles1.push({ name: i.name, filesize: i.filesize, file: i.file, base64: i.base64, uploadstatus: i.uploadstatus, progress: i.progress, rownum: i.rownum }));
      //res.forEach((i:any) => this.attahcment.push(i.base64));
      console.log('Result selectedFiles1', this.selectedFiles1);
      if (this.onFileSelected1.length > 0) {
        this.input1.TransactionNo = this.TransactionNo;
        this.input1.Message = 'ATTACH IMAGE';
        this.input1.isImage = true;
        this.input1.isFile = false;
        this.input1.isMessage = false;
        this.input1.FileAttachment = this.selectedFiles1.map((m: any) => m.base64);
        console.log('this.input1 113', this.input1);
        //this.performSendComment(this.input1);
      }



      return this.selectedFiles1;
    });
    return result;
  }

  public toFilesBase64(files: File[], selectedFiles: any[]): Observable<any[]> {
    const result = new AsyncSubject<any[]>();
    if (files?.length) {
      Object.keys(files)?.forEach(async (file, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          selectedFiles = selectedFiles?.filter(f => f?.name != files[i]?.name)
          selectedFiles.push({ name: files[i]?.name, filesize: `${(files[i].size / 1024).toFixed(2)} KB`, file: files[i], base64: reader?.result as string, uploadstatus: 200, progress: 200, rownum: i + 1 })
          this.attahcment.push(reader?.result as string);
          result.next(selectedFiles);
          if (files?.length === (i + 1)) {
            result.complete();
          }
        };
      });
      return result;
    } else {
      result.next([]);
      result.complete();
      return result;
    }
  }

  hDeclinedProgress() {
    this.resolveEvents = 0;
    this.openpopticketprogress(this.resolveEvents, 'Declined');
  }
  hAcceptProgress() {
    this.resolveEvents = 1;
    this.openpopticketprogress(this.resolveEvents, 'Accept');
  }

  openpopticketprogress(ActionEvent: number, Title: String = '') {
    const _data: any = {};
    let title: String = ''
    _data.TransactionNo = this.ticketDetail.transactionNo;
    _data.TicketNo = this.ticketDetail.ticketNo;
    _data.ActionEvent = ActionEvent;
    _data.Status = 4;
    title = Title;
    if (ActionEvent == 0) {
      _data.Status = 0;
    }
    // else if(ActionEvent == 1)
    //   _data.Status = 4
    console.log('openpopticketprogress', _data, title);



    this.resolveticketDialogRef = this.dialog.open(TicketProgressModalComponent, { data: { item: _data, Title: title } });
    if (this.resolveEvents == 1) {
      this.resolveticketDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {

        console.log('Close Ticket Progress', o);
        console.log('Close Ticket Progress this.ticketindex', this.ticketindex);
        this.Status = o.Status;
        this.ticketDetail.ticketStatusId = 4;
        this.hRemoveItem();
        //this.ticketpending.slice(this.ticketindex,1);
        //console.log('Close Ticket Progress this.ticketpending', this.ticketpending);
      });
    }
    else {
      this.resolveticketDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {

        //console.log('Close Ticket Progress', o);
        //console.log('Close Ticket Progress this.ticketindex', this.ticketindex);
        this.Status = o.Status;
        //this.hRemoveItem();
        //this.ticketpending.slice(this.ticketindex,1);
        //console.log('Close Ticket Progress this.ticketpending', this.ticketpending);
        this.ticketDetail.ticketStatusId = 0;
      });
    }
  }

  hRemoveItem() {
    this.ticketpending.splice(this.ticketindex, 1);
    this.pending = (parseInt(this.pending) - 1).toString();
    this.resolve = (parseInt(this.resolve) + 1).toString();
  }
}



@Component({
  selector: 'app-message-box-dialog',
  templateUrl: 'modal/message-box-dialog.html',
  styleUrl: 'modal/message-box-dialog.scss',
})
export class MessageBoxDialog {

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<HeadTicketsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  confirm() {
    if (this.data.IsForward)
      this.dialogRef.close(true);
    else {
      const dialogRef = this.showMessageBox('progress', null, null);
      if (!this.data.IsCancel)
        setTimeout(() => this.onPerformResolveTicket(dialogRef), 725);
      else
        setTimeout(() => this.onPerfomCancelTicket(dialogRef), 725);
    }
  }

  onConfirmYes() {
    const dialogRef = this.showMessageBox('progress', null, null);
    setTimeout(() => this.onPerformHDResolveTicket(dialogRef), 725);
  }

  onConfirmNo() {
    const dialogRef = this.showMessageBox('progress', null, null);
    setTimeout(() => this.onPerformResolveTicket(dialogRef), 725);
  }

  onPerformResolveTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post(`head/ticket/resolve?ticketNo=${this.data.TicketDetail.ticketNo}`).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been resolved.');
        dialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close(true);
        });
        return;
      }
      alert('Failed');
      ref.close();
    }, (err: any) => {
      alert('System Error!');
      ref.close();
    })
  }

  onPerformHDResolveTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post(`head/ticket/hdresolve?ticketNo=${this.data.TicketDetail.ticketNo}`).subscribe((res: any) => {
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

  onPerfomCancelTicket(ref: MatDialogRef<MessageBoxDialog>) {
    const param: any = {};
    param.ticketNo = this.data.TicketDetail.ticketNo;
    param.RFC = this.data.TicketDetail.RFC;
    rest.post(`head/ticket/dismiss`, param).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been canceled.');
        dialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close(true);
        });
        return;
      }
      alert('Failed');
      ref.close();
    }, (err: any) => {
      alert('System Error!');
      ref.close();
    });
  }

  showMessageBox(type: string, ticketDetail: any, message: any): any {
    return this.dialog.open(MessageBoxDialog, {
      panelClass: type === 'progress' || type === 'message' ? 'mat-dialog-progress' : 'mat-dialog-not-progress',
      disableClose: true,
      width: type !== 'progress' ? '320px' : 'auto',
      data: { Type: type, Message: message, TicketDetail: ticketDetail, IsSuccess: true }
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
  categories: any = [];
  personnels: any = [];
  forwardData: any = {};
  input: any = {};

  async ngOnInit() {
    this.input = await jUser();
    console.log(this.data.TicketDetail)
    if (this.data.IsRequiredOtherDepartment)
      setTimeout(() => this.getDepartmentList());
    else {
      setTimeout(() => this.getCategoryList());
      setTimeout(() => this.getDepartmentPersonnels());
    }
  }

  getDepartmentList = async () => {
    const search: any = { num_row: 0, Search: '' };
    rest.post('department/list', search).subscribe((res: any) => {
      console.log('Department', res);
      if (res.Status === 'ok') {
        this.departments = res.department.filter((o: any) => o.DepartmentID != this.data.TicketDetail.departmentId);
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  getCategoryList(): Observable<any> {

    rest.post('category/listbydepartment', { num_row: 0, Search: '', DepartmentID: this.input.DEPT_ID }).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.categories = res.category;
        console.log('Categories', this.categories);
        // console.log('GetCategoryList inside subscribe', this.categories);
        return this.categories;
        //this.categorylist;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
    return this.categories;
  }

  getDepartmentPersonnels = async () => {
    const search: any = { num_row: 0, Search: '' };
    const department = this.data?.Department ?? this.forwardData.forwardDepartment;
    rest.post(`head/personnels?departmentId=${department}`).subscribe((res: any) => {
      console.log('Personnels', res);
      if (res.Status === 'ok') {
        this.personnels = res.personnels.filter((o: any) => o.userId !== this.data.TicketDetail?.requestId);
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  selectDepartment(val: string) {
    this.forwardData.forwardDepartment = val;
    setTimeout(() => this.getDepartmentPersonnels());
  }

  selectCategory(val: string) {
    this.forwardData.forwardCategory = val;
  }

  selectPersonnel(val: any) {
    this.forwardData.forwardTo = val.userId;
    this.forwardData.forwardToName = val.name;
  }

  setRemarks(val: string) {
    this.forwardData.forwardRemarks = val;
  }

  updateCheck(val: any) {
    console.log(val);
  }

  onConfirmForwardTicket() {
    const dialogRef = this.showMessageBox('progress', null, false);
    if (!this.data.IsRequiredOtherDepartment) {
      if (this.data.TicketDetail.ticketStatusId === 4)
        setTimeout(() => this.onPerformConfirmForwardTicket(dialogRef), 725);
      else
        setTimeout(() => this.onSubmitAssignTicket(dialogRef), 725);
    }
    else
      setTimeout(() => this.onPerformConfirmForwardTicket(dialogRef), 725);
  }

  forwardInputValidation(): boolean {
    let isValid = true;
    if (!this.forwardData.forwardDepartment) {
      isValid = false;
    }
    return isValid;
  }

  onPerformConfirmForwardTicket(ref: MatDialogRef<MessageBoxDialog>) {
    if (!this.forwardInputValidation()) {
      ref.close();
      this.showMessageBox('message', 'Please fill the required fields', false);
      return;
    }

    this.forwardData.ticketNo = this.data.TicketDetail.ticketNo;
    this.forwardData.status = 1;
    rest.post('head/ticket/forward', this.forwardData).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', 'Ticket has been forwarded.', true);
        dialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close(this.forwardData);
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

  assignInputValidation(): boolean {
    let isValid = true;
    if (!this.forwardData.forwardTo) {
      isValid = false;
    }
    else if (!this.forwardData.forwardCategory) {
      isValid = false;
    }
    return isValid;
  }

  onSubmitAssignTicket(ref: MatDialogRef<MessageBoxDialog>) {
    if (!this.assignInputValidation()) {
      ref.close();
      this.showMessageBox('message', 'Please fill the required fields', false);
      return;
    }

    const param: any = {};
    param.ticketNo = this.data.TicketDetail.ticketNo;
    param.assignedDepartment = this.data.Department;
    param.categoryId = this.forwardData.forwardCategory;
    param.assignedTo = this.forwardData.forwardTo;
    param.assignedName = this.forwardData.forwardToName;
    param.forwardRemarks = this.forwardData.forwardRemarks;
    param.status = 4;
    rest.post('head/ticket/assign', param).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', 'Ticket has been assigned.', true);
        dialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close(param);
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

  showMessageBox(type: string, message: any, isSuccess: boolean): any {
    return this.dialog.open(MessageBoxDialog, {
      panelClass: type === 'progress' || type === 'message' ? 'mat-dialog-progress' : 'mat-dialog-not-progress',
      disableClose: true,
      width: type !== 'progress' ? '320px' : 'auto',
      data: { Type: type, Message: message, IsSuccess: isSuccess }
    });
  }
}

@Component({
  selector: 'app-cancel-dialog',
  templateUrl: 'modal/cancel-dialog.html',
  styleUrl: 'modal/cancel-dialog.scss',
})

export class CancelDialog {
  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<HeadTicketsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  confirm(rfc: any) {
    // this.dialogRef.close(true);
    this.data.RFC = rfc;
    const _dialogRef = this.showMessageBox('confirmation', this.data, 'Are you sure you want to cancel this ticket?', true, false);
    _dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result) {
        this.dialogRef.close(true);
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }

  showMessageBox(type: string, ticketDetail: any, message: any, isCancel: boolean, isForward: boolean): any {
    return this.dialog.open(MessageBoxDialog, {
      panelClass: type === 'progress' || type === 'message' ? 'mat-dialog-progress' : 'mat-dialog-not-progress',
      disableClose: true,
      width: type !== 'progress' ? '290px' : 'auto',
      data: { Type: type, Message: message, TicketDetail: ticketDetail, IsCancel: isCancel, IsForward: isForward }
    });
  }
}
