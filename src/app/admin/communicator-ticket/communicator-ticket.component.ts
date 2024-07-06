import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { rest } from '../../+services/services';
import { NewTicketDialogComponent } from './modal/new-ticket-dialog/new-ticket-dialog.component';
import moment from 'moment';
import { additionalNotification, bindLastTransacationNumber, jUser } from '../../+app/user-module';
import { stomp } from '../../+services/stomp.service';
import { timeout } from '../../tools/plugins/delay';
import { device } from '../../tools/plugins/device';
import { BehaviorSubject, Observable, Subject, filter, takeUntil } from 'rxjs';
import { mtCb } from '../../tools/plugins/static';
import { LocalStorageService } from '../../tools/plugins/localstorage';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../auth.service';
import { MatTabGroup } from '@angular/material/tabs';
const batchDone = new Subject<boolean>();

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
  allticket: number = 0;
  loader = true;


  ngOnInit() {
    // alert('Yeeee');
    // this.onTabChange({ tab: 0, IsReset: true });
    //console.log('Communicator ngOnit AuthServie this.authService.requesttickect.data.IsAssigned', this.authService.requesttickect.data.IsAssigned);
    
    this.getTicketCount();
    device.ready(() => this.stompWebsocketReceiver());
    //this.tab = 0;

    if(Object.keys(this.authService.requesttickect).length > 0){
      this.tab = 0
      if(this.authService.requesttickect.data.IsAssigned){
        this.tab = 1;
      }
      else{
        this.tab = 0;
      }
      
      //this.nextBatch({tab:this.tab, search:this.authService.requesttickect.TransactionNo, IsReset: false})
      this.searchTicket(this.authService.requesttickect.data.TransactionNo);
    }
    
  }

  getTicketCount(): Observable<any> {
    rest.post('communicator/count').subscribe(async (res: any) => {
      //this.ticketcount.push(res.TicketCount);

      //Object.assign(this.ticketlistcount, this.ticketcount) ;

      //res.TicketCount.foreach((o:any) => console.log('foreach', 0));
      this.collectioncount = res.TicketCount;
      //this.ticketlistcount = ({Pending: res.TicketCount.Pending, Resolve: res.TicketCount.Resolve, AllTicketCount: res.TicketCount.AllTicketCount});
      this.unassigned = res.TicketCount.UnAssigned;
      this.assigned = res.TicketCount.Assigned;
      this.allticket = res.TicketCount.AllTicketCount;

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
    console.log('Communicator Component', iscom);
    stomp.ready(() => (stomp.refresh(), stomp.connect()));
  }
  receivedRequestTicketCommunicator(data: any) {


    var content = data.content;
    //this.TicketNo = content.TicketNo;
    console.log('Communication Page', data.content);
    //this.collections.push(data.content);
    let ticketexist = this.collections.find((o:any) => o.ticketNo == data.ticketNo);
    if(ticketexist) return;

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







  searchTicket(val: any){
    try {
      this.searchValue = !val?null:val;
      this.collections = [];
      this.virtualScroll.setRenderedRange({start:0,end:0});
      this.nextBatch({tab:this.tab, IsReset: true});
    } catch (error) {
      
    }
    // this.collections = this.backupCollections;
    // this.collections = this.collections.filter((i:any)=>i.title.includes(val));
    // console.log(this.collections);
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
  async nextBatch(val: any){
    console.log('Virtual Scroll end', this.virtualScroll.getRenderedRange().end);
    //console.log(`new batch ${val.tab}`);
    //console.log(`tab ${this.tab} = val.tab ${val.tab}`);
    let end = 0;
    let total = 0;
    if(this.tab !== val.tab){
      this.collections = [];
    }else{
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
    const filter = {tab: val.tab, row: total, search: this.searchValue};
    //console.log('filter', filter);
    this.tab = val.tab;
    console.log(`end ${end} <= total ${total} : batch ${this.batch}`);
    if(end === total){
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
        if(res.length > 0)
          this.collections = this.collections.concat(res);
        //console.log('collections batch = ',this.batch,this.collections);
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




  next (item: any, idx: number) {
    // if(item.departmentId) return;
    //console.log('next idx', idx, item);
    this.router.navigate([item.ticketNo], { relativeTo: this.route });
    // this.router.navigateByUrl('/head/dashboard/tickets/sample');
    this.ticketTitle = item.title;
    this.ticketDetail = item;
    this.stepper.next();
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
    if(item.S_OPN) return;
    this.performCommunicatorSeenTicket(item.transactionNo);
    this.collections[idx] = item;
    item.S_OPN = true;
    additionalNotification(-1);
    //console.log('next ths.collections', this.collections);

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
    // this.router.navigate(['../tickets'], {relativeTo: this.route});
    this.router.navigate(['../receivedtickets'], { relativeTo: this.route });
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
      //console.log(this.collections);
    });
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
    if (!this.ticketDetail.assignedDepartment) return;
    const dialogRef = this.showMessageBox(true, false, null);
    this.ticketDetail.status = 2;
    setTimeout(() => this.onSubmitForwardTicket(dialogRef), 725);
  }

  onSubmitForwardTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post('communicator/ticket/forward', this.ticketDetail).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox(false, true, 'Ticket has been forwarded');
        dialogRef.afterClosed().subscribe(() => {
          this.goBack();
          // this.onTabChange(this.tab);
          this.collections = [];
          this.virtualScroll.setRenderedRange({start:0,end:0});
          this.nextBatch({tab: this.tab, IsReset: true});
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

  showMessageBox(isProgress: boolean, isMessage: boolean, message: any): any {
    return this.dialog.open(MessageBoxDialog, {
      disableClose: true,
      width: isMessage ? '20%' : 'auto',
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
