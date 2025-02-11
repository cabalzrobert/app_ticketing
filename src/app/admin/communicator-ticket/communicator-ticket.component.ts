import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { DialogPosition, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { rest } from '../../+services/services';
import { NewTicketDialogComponent } from './modal/new-ticket-dialog/new-ticket-dialog.component';
import moment from 'moment';
import { additionalNotification, bindLastTransacationNumber, jUser } from '../../+app/user-module';
import { stomp } from '../../+services/stomp.service';
import { timeout } from '../../tools/plugins/delay';
import { device } from '../../tools/plugins/device';
import { AsyncSubject, BehaviorSubject, Observable, Subject, filter, takeUntil, timer } from 'rxjs';
import { mtCb } from '../../tools/plugins/static';
import { LocalStorageService } from '../../tools/plugins/localstorage';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../auth.service';
import { MatTabGroup } from '@angular/material/tabs';
import { TicketProgressModalComponent } from '../modalpage/ticket-progress-modal/ticket-progress-modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ViewAttachImageModalComponent } from '../modalpage/view-attach-image-modal/view-attach-image-modal.component';
import { TicketDescriptionModalComponent } from '../requestorticketpage/modal/ticket-description-modal/ticket-description-modal.component';
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
  selector: 'app-communicator-ticket',
  templateUrl: './communicator-ticket.component.html',
  styleUrl: './communicator-ticket.component.scss'
})
export class CommunicatorTicketComponent {
  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private ls: LocalStorageService, private authService: AuthService) {
    this.userDetail = this.ls.getItem1('UserAccount');
  }
  @ViewChild('stepper') stepper!: MatStepper;
  //@ViewChild('tabRef') tabRef!: MatTabGroup;
  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;
  userDetail: any;
  height = 'height: calc(100% - 100px)';
  isTicketContentShow = false;
  batch = 0;
  collections: any = [];
  backupCollections: any = [];
  collectionreceived: any = [];
  ticketTitle = '';
  ticketDetail: any;
  _description: any;
  searchValue: any;
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
  input: any = {};
  subs: any = {};
  prop: any = {};
  collectioncount: any = {};
  unassigned: number = 0;
  assigned: number = 0;
  resolved: number = 0
  allticket: number = 0;
  loader = true;
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'p') {
      // this.print();
      // console.log('Ctrl + P is pressed');
      event.preventDefault();
    }
  }
  @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;
  print() {
    //this.viewport?.detach();
    this.viewport?.checkViewportSize();
    setTimeout(() => {
      window.print();
    }, 100);
  }


  ngOnInit() {
    // alert('Yeeee');
    // this.onTabChange({ tab: 0, IsReset: true });
    console.log('Communicator ngOnit AuthServie this.authService.requesttickect.data.IsAssigned', this.authService.requesttickect.data);
    console.log('Communicator ngOnit AuthServie this.authService.requesttickect.data.IsAssigned', this.authService.requesttickect.IsAssigned);

    this.getTicketCount();
    device.ready(() => this.stompWebsocketReceiver());
    //this.tab = 0;

    if (Object.keys(this.authService.requesttickect).length > 0) {
      this.tab = 0
      if (this.authService.requesttickect.IsAssigned) {
        this.tab = 3;
      }
      else {
        this.tab = 3;
      }
      console.log('receivedtickets', this.authService.requesttickect.TransactionNo)
      //this.nextBatch({tab:this.tab, search:this.authService.requesttickect.TransactionNo, IsReset: false})
      this.searchTicket(this.authService.requesttickect.TransactionNo);
    }

  }

  IsMobile(): boolean {
    if (window.innerWidth <= 767)
      return true;
    return false;
  }

  isSideToggle = false;
  sideToggle() {
    this.isSideToggle = !this.isSideToggle;
    console.log('side toggle', this.isSideToggle);
  }

  getTicketCount(): Observable<any> {
    rest.post('communicator/count').subscribe(async (res: any) => {
      //this.ticketcount.push(res.TicketCount);

      //Object.assign(this.ticketlistcount, this.ticketcount) ;

      //res.TicketCount.foreach((o:any) => console.log('foreach', 0));
      this.collectioncount = res.TicketCount;
      //this.ticketlistcount = ({Pending: res.TicketCount.Pending, Resolve: res.TicketCount.Resolve, AllTicketCount: res.TicketCount.AllTicketCount});
      this.unassigned = Number(res.TicketCount.UnAssigned);
      this.assigned = Number(res.TicketCount.Assigned);
      this.resolved = Number(res.TicketCount.Ressolved);
      this.allticket = Number(res.TicketCount.AllTicketCount);

      console.log('this.ticketlistcountt', this.collectioncount);
      return this.collectioncount;
    });

    console.log('this.ticketcountt', this.collectioncount);
    return this.collectioncount;
  }

  private async stompWebsocketReceiver() {
    //this.webSocketService.connect();
    this.input = await jUser();
    var iscom = (this.input.isCommunicator == true) ? 1 : 0;
    this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
    this.subs.wsDisconnect = stomp.subscribe('#disconnect', () => this.disconnect());
    this.subs.ws1 = stomp.subscribe('/' + iscom + '/ticketrequest/iscommunicator', (json: any) => this.receivedRequestTicketCommunicator(json));
    this.subs.ws1 = stomp.subscribe('/communicator', (json: any) => this.receivedRequestTicketCommunicator(json));
    this.subs.ws1 = stomp.subscribe('/requestorhead', (json: any) => this.receivedRequestTicketCommunicator(json));
    this.subs.ws1 = stomp.subscribe('/forwardticket', (json: any) => this.receivedRequestTicketCommunicator(json));
    this.subs.ws1 = stomp.subscribe(`/return`, (json: any) => this.receivedDeptHeadReturnNotify(json));
    this.subs.ws1 = stomp.subscribe(`/resolve`, (json: any) => this.receivedRequestorApprovalNotify(json));
    this.subs.ws1 = stomp.subscribe(`/comment`, (json: any) => this.receivedComment(json));
    console.log('Communicator Component', iscom);
    stomp.ready(() => (stomp.refresh(), stomp.connect()));
  }

  receivedRequestorApprovalNotify(data: any) {
    console.log('receivedRequestorApprovalNotify', data.content);
    this.ticketDetail.status = data.content.status;
    this.ticketDetail.ticketStatusId = data.content.ticketStatusId;

    if (this.ticketDetail.ticketStatusId === 1) {
      this.assigned = this.assigned - 1;
      this.allticket = this.allticket - 1;
      this.resolved = this.resolved + 1;
    }
  }

  receivedDeptHeadReturnNotify(data: any) {
    console.log('receivedDeptHeadReturnNotify', data.content);
    this.ticketDetail.status = data.content.status;
    this.ticketDetail.ticketStatusId = data.content.ticketStatusId;
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
    console.log('Communication Page', data.content);
    //this.collections.push(data.content);
    let ticketexist = this.collections.find((o: any) => o.ticketNo == data.content.ticketNo);
    if (ticketexist) return;

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
    console.log('Communicator StompWebReceiver this.collections', this.collections);
    return this.collections;

    //this.collections.unshift(data.content);

    //console.log('this.collection Websocket', this.collections);
    // if (this.input.LastTransactionNo == content.TransactionNo) return;

    // //console.log('this.TicketNo 299', content.TransactionNo);
    // bindLastTransacationNumber(content.TransactionNo);
    // additionalNotification(1);
    // this.refreshData();
    // return this.input.NotificationCount;
  }

  receiveTicket(item: any): Observable<any> {
    return this.collections;
  }
  private async refreshData() {
    //jUserModify();
    this.input = await jUser();
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


  searchTicket(val: any) {
    try {
      this.searchValue = !val ? null : val;
      this.collections = [];
      this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
      this.nextBatch({ tab: this.tab, IsReset: true });
    } catch (error) {

    }
    // this.collections = this.backupCollections;
    // this.collections = this.collections.filter((i:any)=>i.title.includes(val));
    // console.log(this.collections);
  }

  isFilterAscending = false;
  filter() {
    const ascending: any = this.backupCollections;
    const descending: any = this.backupCollections;
    let _collections: any = [];
    this.isFilterAscending = !this.isFilterAscending;
    if (this.isFilterAscending)
      _collections = [...descending].sort((a, b) => a.rowNum < b.rowNum ? -1 : 1);
    else
      _collections = [...ascending].sort((a, b) => a.rowNum > b.rowNum ? -1 : 1);
    this.collections = [..._collections];
    console.log(this.collections, this.backupCollections);
  }

  // onTabChange(val: any) {
  //   this.searchValue = null;
  //   this.tab = val.tab;
  //   val.IsReset = false;
  //   if (!this.subs) return this.collections;
  //   if (this.subs.s1) this.subs.s1.unsubscribe();
  //   console.log('val.IsReset', val.IsReset);
  //   console.log('this.subs.s1', this.subs.s1);
  //   const filter = {tab:this.tab, row: this.batch};
  //   rest.post('communicator/tickets', filter).subscribe((res: any) => {
  //     if (res != null) {

  //       console.log('onTabChange result', res);
  //       if (!val.IsReset && res.length < 1) this.collections = res.map((o: any) => this.collectionListDetails(o));
  //       else res.forEach((o: any) => this.collections.push(this.collectionListDetails(o)));
  //       /*
  //       this.collections = res;
  //       this.collections.forEach((e: any) => {
  //         // e.dateCreated = moment(e.dateCreated).format('DD MMM yyyy');
  //       });
  //       */
  //       return;
  //     }
  //     alert('Failed');
  //   }, (err: any) => {
  //     alert('System Error');
  //   })
  // }
  async nextBatch(val: any) {
    // console.log('Virtual Scroll end', this.virtualScroll.getRenderedRange().end);
    console.log(`new batch ${val.tab}`);
    // console.log(`tab ${this.tab} = val.tab ${val.tab}`);
    let end = 0;
    let total = 0;
    if (this.tab !== val.tab) {
      this.collections = [];
    } else {
      end = this.virtualScroll.getRenderedRange().end;
      total = this.collections.length;
    }
    //console.log('newBatch end', end);
    // if(val.tab===undefined) val.tab = this.tab;
    // if (!this.subs) return this.collections;
    // if (this.subs.s1) this.subs.s1.unsubscribe();
    // console.log('val.IsReset', val.IsReset);
    // console.log('this.subs.s1', this.subs.s1);
    // console.log(`total communicator next batch`);
    //val.tab = this.tab;
    const filter = { tab: val.tab, row: total, search: this.searchValue };
    //console.log('filter', filter);
    this.tab = val.tab;
    console.log(`end ${end} <= total ${total} : batch ${this.batch}`);
    if (end === total) {
      this.loader = true;
      //console.log(filter);
      //console.log('newBatch this.collections 267',this.batch,this.collections[end]);
      await this.onPerformGetTickets(filter, val);
    }
  }

  async onPerformGetTickets(filter: any, val: any) {
    rest.post('communicator/tickets', filter).pipe(takeUntil(batchDone)).subscribe((res: any) => {
      if (res != null) {
        batchDone.next(true);
        //console.log('onTabChange result', res);
        // if (!val.IsReset || res.length < 1) this.collections = res.map((o: any) => this.collectionListDetails(o));
        // else res.forEach((o: any) => this.collections.push(this.collectionListDetails(o)));

        // return this.collections;
        if (res.length > 0)
          this.collections = this.collections.concat(res);
        this.backupCollections = this.collections;
        console.log('collections batch = ', this.batch, this.collections);
        let cnt = parseInt((this.collections).length);
        //console.log('collections batch 285 = ',this.collections[cnt-1]);
        this.loader = false;
        return this.collections;
      }
      else
        alert('Failed');
    }, (err: any) => {
      alert('System Error');
    })
  }

  collectionListDetails(item: any) {
    return item;
  }

  dateFormatted(isList: boolean, date: any) {
    if (isList) {
      const formattedDate = moment(date).format('MMM D yyyy hh:mm A');
      return formattedDate;
      /*
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
      */
    }
    else {
      return moment(date).format('DD MMM yyyy');
    }
  }


  _hour: number = 0;
  _minute: number = 0;
  _second: number = 0;
  _elapsedtime: string = '';
  interval: any;

  vtdindex: number = 0;
  vtdcounter: number = 0;
  vtdfirstcount: number = 0;
  cthHeight: string = '15%';
  showtext: string = 'Show more';
  _sheight: string = '';
  _swidth: number = 0;
  _attachment: number = 0

  next(item: any, idx: number) {
    // if(item.departmentId) return;
    console.log('next idx', idx, item);
    this._attachment = 0;
    if (item.attachment != '')
      this._attachment = JSON.parse(item.attachment).length;
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
    this._description = item.description;
    this.ticketDetail = item;
    this.TransactionNo = item.transactionNo;


    if (window.innerWidth >= 768 && window.innerWidth <= 1572) {
      this.vtdindex = 100;
      this.vtdcounter = 100;
      this.vtdfirstcount = 100;
      this.vtdindex = (this._description.substring(0, 100)).lastIndexOf(' ');
      if (this.vtdindex > 100)
        this.vtdindex = 100;
      this.vtdcounter = this.vtdindex;
    }
    else {
      this.vtdindex = 300;
      this.vtdcounter = 300;
      this.vtdfirstcount = 300;
      this.vtdindex = (this._description.substring(0, 300)).lastIndexOf(' ');
      if (this.vtdindex > 300)
        this.vtdindex = 300;
      this.vtdcounter = this.vtdindex;
    }
    console.log('next _description', this._description);

    console.log('Ticket Detail', this.ticketDetail);
    this.stepper.next();
    this.getCommentList(this.ticketDetail.transactionNo);
    if (item.ticketStatus != 'Closed' && item.ticketStatus != 'Cancel')
      this.getLElapsedTime1();
    else
      clearInterval(this.interval);
    if (!item.departmentId)
      setTimeout(() => this.getDepartmentList());
    else if (item.isAssigned)
      setTimeout(() => this.performGetTicketComments());
    //else return;
    // return this.performCommunicatorSeenTicket(item.NotificationID, (err: any) => {
    //   if (!err) {
    //     return additionalNotification(-1);
    //   }
    //   item.IsOpen = false;

    // });
    //item.pipe(filter(o => o)).subscribe()
    //this.collections[idx] = o;
    if (item.isOpened) return;
    // this.performCommunicatorSeenTicket(item.transactionNo);
    this.performSeenTicket(item.notificationId);
    this.collections[idx] = item;
    this.ticketDetail.isOpened = true;
    // additionalNotification(-1);
    //console.log('next ths.collections', this.collections);
    // if(item.ticketStatusId == 0){
    //   this.elapsedTimeStart1();
    // }

  }

  performSeenTicket(NotificationID: any) {
    console.log('performCommunicatorsSeenTicket transactionNo', NotificationID)
    this.subs.s2 = rest.post('notification/' + NotificationID + '/seen').subscribe(async (res: any) => {
      if ((res || {}).status != 'error') {
        console.log('seen ticket', res);
        //if (callback != null) callback();
        return;
      }
      console.log('failed');
    });
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
    let _h: string = ((this._hour).toString().length == 1) ? `0${this._hour}` : (this._hour).toString();
    let _m: string = ((this._minute).toString().length == 1) ? `0${this._minute}` : (this._minute).toString();
    let _s: string = ((this._second).toString().length == 1) ? `0${this._second}` : (this._second).toString();
    this._elapsedtime = `${_h}h ${_m}m ${_s}s`;
    this.ticketDetail.elapsedTime = this._elapsedtime;
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
    //console.log('Elapsed Time: ',elapsedTime);
    this.ticketDetail.elapsedTimeString = elapsedTime;
  }

  openTicketDetialsDialog?: MatDialogRef<TicketDescriptionModalComponent>
  viewTicketDetails(event: any) {
    let po: DialogPosition = { top: event.clientY + 'px' };
    this.dialog.closeAll();
    this.openTicketDetialsDialog = this.dialog.open(TicketDescriptionModalComponent, {
      data: this._description,
      hasBackdrop: false,
      position: po
    });
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

  performCommunicatorSeenTicket(transactionNo: any) {
    console.log('performCommunicatorsSeenTicket transactionNo', transactionNo)
    this.subs.s2 = rest.post('ticket/communicator/' + transactionNo + '/seen').subscribe(async (res: any) => {
      if ((res || {}).status != 'error') {
        //if (callback != null) callback();
        return;
      }
    });
  }

  performGetTicketComments = async () => {
    rest.post(`communicator/ticket/comments?transactionNo=${this.ticketDetail.transactionNo}`, {}).subscribe((res: any) => {
      if (res) {
        // this.messageHandler = [...this.messageHandler,res];
        this.ticketDetail.messageHandler = res;
        //console.log(this.ticketDetail);
        return
      }
      alert('Failed');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  goBack() {
    clearInterval(this.interval);
    // this.router.navigate(['../tickets'], {relativeTo: this.route});
    this.router.navigate(['../receivedtickets'], { relativeTo: this.route });
    // location.assign(this.router.url);
    this.stepper.reset();
    this.departments = [];
    this.collections = [];
    this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
    this.nextBatch({ tab: this.tab });
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewTicketDialogComponent, {
      width: '25%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.collections = [...this.collections, result];
      //console.log(this.collections);
    });
  }

  hViewAttachment() {
    console.log('hViewAttachment', this.ticketDetail);
    let viewattachment: any = [];
    viewattachment = JSON.parse(this.ticketDetail.attachment);
    let attachment: any = [];
    viewattachment.forEach((o: any) => attachment.push({ URL: o.base64 }));
    console.log('hViewAttachment URL 281', attachment);
    console.log('hViewAttachment URL 282', attachment[0]);
    this.ticketViewAttachment = this.dialog.open(ViewAttachImageModalComponent, { data: { item: attachment } });
  }

  getDepartmentList = async () => {
    const search: any = { num_row: 0, Search: '' };
    rest.post('department/list', search).subscribe((res: any) => {
      //console.log(res);
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
    console.log('Forward Ticket by Robert');
    if (!this.ticketDetail.departmentId) return;
    const dialogRef = this.showMessageBox('progress', null, null, false, false);
    this.ticketDetail.status = 2;
    setTimeout(() => this.onSubmitForwardTicket(dialogRef), 725);
  }

  onSubmitForwardTicket(ref: MatDialogRef<MessageBoxDialog>) {
    const param: any = {};
    param.ticketNo = this.ticketDetail.ticketNo;
    param.forwardDepartment = this.ticketDetail.departmentId;
    param.status = 2;
    rest.post('communicator/ticket/forward', param).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been forwarded', false, false);
        dialogRef.afterClosed().subscribe(() => {
          this.unassigned = this.unassigned - 1;
          this.assigned = this.assigned + 1;
          this.goBack();
          // this.collections = [];
          // this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
          // this.nextBatch({ tab: this.tab, IsReset: true });
        })
        return;
      }
      alert('Failed');
      ref.close()
    }, (err: any) => {
      alert('System Error!');
      ref.close();
    });
  }

  onResolvingTicket() {
    const dialogRef = this.showMessageBox('confirmation', this.ticketDetail, 'You are about to resolve this ticket. Are you sure all requirements have been meet?', false, false);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('onResolving', result);
      if (result) {

        const progDialogRef = this.showMessageBox('progress', null, null, false, false);
        setTimeout(() => this.onPerformResolveTicket(progDialogRef), 725);

        // if(this.ticketDetail.isAssigned){
        //   this.ticketDetail.status = 1;
        //   this.ticketDetail.ticketStatusId = 3;
        // }
        // else
        // {
        //   this.ticketDetail.isDone = true;
        // }
      }
    })
  }

  onPerformResolveTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post(`head/ticket/resolve?ticketNo=${this.ticketDetail.ticketNo}`).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been resolved.', false, false);
        dialogRef.afterClosed().subscribe(() => {
          this.ticketDetail.ticketStatusId = 3;
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

  decline() {
    rest.post(`head/ticket/cancel?ticketNo=${this.ticketDetail.ticketNo}`, {}).subscribe((res: any) => {
      if (res.Status === 'ok') {
        if (this.ticketDetail.status === 1 && this.ticketDetail.ticketStatusId === 3) {
          this.ticketDetail.ticketStatusId = 4;
        }
        // console.log(this.ticketDetail.status,this.ticketDetail.ticketStatusId);
        // if(this.ticketDetail.status===3&&this.ticketDetail.ticketStatusId===3&&this.userDetail.USR_ID!==this.ticketDetail.assignedId){
        //   this.ticketDetail.status = 4;
        //   this.ticketDetail.ticketStatusId = 4;
        // }
        // if(this.ticketDetail.status===3&&this.ticketDetail.ticketStatusId===3&&this.userDetail.USR_ID===this.ticketDetail.assignedId){
        //   this.ticketDetail.status = 0;
        //   this.ticketDetail.ticketStatusId = 0;
        //   this.ticketDetail.isAssigned = false;
        //   this.ticketDetail.assignedName = null;
        // }
        // else
        //   this.ticketDetail.isDone = false;
        return;
      }
      alert('Failed');
    }, (err: any) => {
      alert('System Error!');
    });
  }

  // showMessageBox(isProgress: boolean, isMessage: boolean, message: any): any {
  //   return this.dialog.open(MessageBoxDialog, {
  //     disableClose: true,
  //     width: isMessage ? '20%' : 'auto',
  //     data: { isProgress: isProgress, isMessage: isMessage, message: message }
  //   });
  // }

  showMessageBox(type: string, ticketDetail: any, message: any, isCancel: boolean, isForward: boolean): any {
    return this.dialog.open(MessageBoxDialog, {
      panelClass: type === 'progress' ? 'mat-dialog-progress' : 'mat-dialog-not-progress',
      disableClose: true,
      width: type !== 'progress' ? '320px' : 'auto',
      data: { Type: type, Message: message, TicketDetail: ticketDetail, IsCancel: isCancel, IsForward: isForward }
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
  // allticket: string = '';
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
    _data.TransactionNo = this.TransactionNo;
    _data.TicketNo = this.TicketNo;
    _data.ActionEvent = ActionEvent;
    _data.Status = 4;
    title = Title;
    if (ActionEvent == 0) {
      _data.Status = 3
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

  constructor(private dialogRef: MatDialogRef<CommunicatorTicketComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  confirm() {
    this.dialogRef.close(true);
  }
}
