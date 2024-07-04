import { Component, HostListener, OnInit, input } from '@angular/core';
import { additionalRequestNotification, bindLastLastNotificatioinID, bindLastNotificationID, jUser, jUserModify, requestnotificationCount } from '../../+app/user-module';
import { device } from '../../tools/plugins/device';
import { stomp } from '../../+services/stomp.service';
import { Capacitor } from '@capacitor/core';
import { rest } from '../../+services/services';
import { timeout } from '../../tools/plugins/delay';
import { Router } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { mtCb } from '../../tools/plugins/static';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';
import { CommunicatorTicketComponent } from '../communicator-ticket/communicator-ticket.component';
import { AuthService } from '../../auth.service';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { time } from 'console';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss'
})
export class OverviewPageComponent implements OnInit {
  hMouseOut(data: any, idx: number) {
    if (data.IsOpen) return;
    data.showMarkasRead = true;

  }
  hMouseOver(data: any, idx: number) {
    if (data.IsOpen) return;
    data.showMarkasRead = false;
  }
  hMarkAsRead(data: any, idx: number) {
    //alert('You Click Mark as Read Button');
    this.markasread = true;
    this.performSeenTicket(data.NotificationID);
    data.IsOpen = 1;
    data.showMarkasRead = true;
    return this;
  }
  hAll() {
    this.isall = true;
    this.isread = false;
    this.isunread = false;
    this.ismarkallasread = false;
    this.ticketnotification = [];
    this.loader = true;
    timeout(() => this.getTicketListDelay({ IsRest: true, isRead: null }), 275);
  }
  hRead() {
    this.isall = false;
    this.isread = true;
    this.isunread = false;
    this.ismarkallasread = false;
    this.ticketnotification = [];
    this.loader = true;
    timeout(() => this.getTicketListDelay({ IsRest: true, isRead: '1' }), 275);
  }
  hUnread() {
    this.isall = false;
    this.isread = false;
    this.isunread = true;
    this.ismarkallasread = false;
    this.ticketnotification = [];
    this.loader = true;
    timeout(() => this.getTicketListDelay({ IsRest: true, isRead: '0' }), 275);
  }
  hMarkAllAsRead() {

    this.isall = false;
    this.isread = false;
    this.isunread = false;
    this.ismarkallasread = true;
    let lst = JSON.stringify(this.ticketnotification);
    this.performSeenAllTicket({ Notificationlist: lst });
    this.ticketnotification.forEach((o: any) => o.IsOpen = 1);
    this.ismarkallasread = false;
  }
  performSeenAllTicket(item: any) {
    this.subs.s2 = rest.post('notification/seen/all', item).subscribe(async (res: any) => {
      if ((res || {}).status != 'error') {
        //if (callback != null) callback();
        return;
      }
    });
  }
  async hOpenNotification(data: any, idx: number) {
    //timeout(() => this.performIsAssignedTicket(data.TransactionNo));


    if (this.markasread) {
      this.markasread = false;
      return;
    }
    this.performSeenTicket(data.NotificationID);
    this.ticketnotification[idx] = data;
    data.S_OPN = true;
    additionalRequestNotification(-1);
    if (data.Type == 'Ticket-Request') {
      await this.performIsAssignedTicket(data.TransactionNo, data)


      //timeout(() => this._communicator.hSearchReceivedTicket(data.Description));
    }
    if (data.Type == 'Forward-Ticket' || data.Type == 'Assigned-Ticket') {
      this.authService.requesttickect = data;
      this.router.navigateByUrl('dashboard/assignedticket');
      //timeout(() => this._communicator.hSearchReceivedTicket(data.Description));
    }
  }
  public performIsAssignedTicket(transactionNo: any, data: any) {
    this.isassigned = false;
    this.subs.s2 = rest.post('ticket/isassigned?transactionNo=' + transactionNo).subscribe(async (res: any) => {
      if ((res || {}).status != 'error') {
        this.ticketisassigned.transactionNo = transactionNo;
        this.ticketisassigned.IsAssigned = res;
        this.authService.requesttickect.IsAssigned = res;
        if (data.Type == 'Ticket-Request') {
          data.IsAssigned = res;
          this.authService.requesttickect = { data };
          this.router.navigateByUrl('dashboard/receivedtickets');
        }

        //this.ticketisassigned = ({transactionNo: transactionNo, IsAssigned: res});

        //Assigned data for Communicator to View
        return this.ticketisassigned;
      }
    });
    return this.ticketisassigned
  }
  performSeenTicket(NotificationID: any) {
    console.log('performCommunicatorsSeenTicket transactionNo', NotificationID)
    this.subs.s2 = rest.post('notification/' + NotificationID + '/seen').subscribe(async (res: any) => {
      if ((res || {}).status != 'error') {
        //if (callback != null) callback();
        return;
      }
    });
  }
  constructor(public router: Router, private dialog: MatDialog, private authService: AuthService) {
    device.ready(() => this.stompWebsocketReceiver());
  }
  hViewSubmittedTickets() {
    this.router.navigateByUrl('dashboard/ticket');
  }
  hViewAssignedTickets() {
    this.router.navigateByUrl('dashboard/assignedticket');
  }
  loader = true;
  subs: any = {};
  input: any = {};
  lastnotificationid: string = '';
  prop: any = {};
  UserAccount: string = '';
  UserType: string = '';
  profilePicture: string = '';
  ticketcount: any = [];
  totaltickets: number = 0;
  assignedpending: number = 0;
  assignedresolve: number = 0;
  totalassignedticket: number = 0;
  submittedpending: number = 0;
  submittedresolve: number = 0;
  totalsubmittedticket: number = 0
  ticketnotification: any = [];
  ticketnotificationReceived: any = [];
  notificationID: string = '';
  unreadNotification: number = 0;

  iscom: number = 0;
  isdepthead: number = 0;
  isall: boolean = true;
  isread: boolean = false;
  isunread: boolean = false;
  ismarkallasread: boolean = false;
  markasread: boolean = false;
  hideElement: boolean = true;
  isassigned: boolean = false;
  ticketisassigned: any = {};

  async ngOnInit(): Promise<void> {
    //console.log('Overview', Capacitor.platform);
    //console.log('ngOnInit this', this);
    this.onWindowInitialize();
    console.log('Overview window', window);
    device.ready();
    // this.subs.u = jUserModify(async () => {
    //   const u: any = await jUser();
    //   console.log('ngOnInt const u 80', u);
    //   Object.assign(this.input, u);
    //   console.log('ngOnInt this.input 1', this.input);

    // });
    //console.log('ngOnInt this.subs 1', this.subs);
    this.input = await jUser();
    let item: any = { isCom: this.input.isCommunicator ? 1 : 0, isDept: this.input.isDeptartmentHead ? 1 : 0 };
    console.log('let item', item);
    item.DepartmentID = this.input.DEPT_ID
    //device.ready(async () => requestnotificationCount(item));
    timeout(async () => await requestnotificationCount(item));
    this.UserAccount = this.input.FLL_NM;
    this.profilePicture = this.input.PRF_PIC;

    if (!this.input.isCommunicator && !this.input.isDeptartmentHead) {
      this.UserType = 'User';
    }
    else if (this.input.isCommunicator && !this.input.isDeptartmentHead) {
      this.UserType = 'Communicator';
    }
    else if (!this.input.isCommunicator && this.input.isDeptartmentHead) {
      this.UserType = 'Department Head';
    }
    else if (this.input.isCommunicator && this.input.isDeptartmentHead) {
      this.UserType = 'Communicator and Department Head';
    }
    //window.location.reload();
    //device.ready(() => setTimeout(() => this.getTicketCount(), 275));
    await this.getTicketCount();
    //console.log('Overivew Ticket Count 68', this.assignedpending);

    this.iscom = (this.input.isCommunicator == true) ? 1 : 0;
    this.isdepthead = (this.input.isDeptartmentHead == true) ? 1 : 0;
    timeout(() => this.getTicketListDelay({ IsRest: true, isRead: null }), 275);

    //timeout(() => this.getTicketList({IsRest: true}), 275);
    //await this.getTicketList({IsRest: true, isCom: item.isCom, isDept: item.isDept});

    // await this.getTicketListDelay({ IsReset: true }, mtCb, 1275);
    //console.log('ngOnInit this.ticketnotification', this.input);

    //console.log('this.ticketnotification 84', this.input.RequestNotificationCount);

    console.log('Last NotificationID 95', await this.lastnotificationid);
    console.log('this.input.RequestNotificationCount 98', this.input.RequestNotificationCount);
    this.unreadNotification = await this.input.RequestNotificationCount;
  }

  collapsed = false;
  screenWidth = 0;
  changeclass = false;
  @HostListener('window:resize', ['$event'])
  onWindowInitialize() {
    this.screenWidth = window.innerWidth;
    console.log('Overview Initialize window.innerwidth', window.innerWidth);
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.changeclass = false;
    }
    else if (this.screenWidth > 768 && this.screenWidth <= 1300) {
      this.changeclass = true
    }

    else {

      this.changeclass = false;
      this.collapsed = true;
    }
  }

  profile() {
    const dialogRef = this.dialog.open(ProfileComponent, {
      // maxHeight: '0%',
      height: '80%',
      width: '50%'
    })
  }

  getTicketCount(): Observable<any> {
    rest.post('overview/count').subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        console.log('this.ticketcountt res.ticket 74', res.count);
        res.count.forEach((o: any) => this.ticketcount.push(o));
        this.totaltickets = this.ticketcount.TotalTickets;

        this.assignedpending = this.ticketcount.AssignedPending;
        this.assignedresolve = this.ticketcount.AssignedResolve;
        this.submittedpending = this.ticketcount.SubmittedPending;
        this.submittedresolve = this.ticketcount.SubmittedResolve;
        this.totalassignedticket = this.assignedpending + this.assignedresolve;
        this.totalsubmittedticket = this.submittedpending + this.submittedresolve;
        return this.ticketcount;
      }
      return this.ticketcount;
    });
    return this.ticketcount;
  }
  getTicketListDelay(filter: any, callback: Function = mtCb, delay: number = 175) {
    if (this.subs.t1) this.subs.t1.unsubscribe();
    this.prop.IsFiltering = !filter.IsFiltering;
    this.subs.t1 = timeout(async () => await this.getTicketList(filter, callback), delay);
  }
  refreshTicketList(item: any): Observable<any> {
    this.ticketnotification.unshift(item);
    return this.ticketnotification
  }

  getTicketList(item: any, callback: Function = mtCb): Observable<any> {
    if (!this.subs) return this.ticketnotification;
    if (this.subs.s1) this.subs.s1.unsubscribe();
    item.isCom = this.iscom;
    item.isDept = this.isdepthead;
    item.DepartmentID = this.input.DEPT_ID;

    this.subs.s1 = rest.post('notification', item).subscribe(async (res: any) => {
      if (res != null) {
        var cnt = parseInt(res.length);
        if (cnt == 0) {
          this.ticketnotification = [];
          this.loader = false;
          return this.ticketnotification;
        }

        if (item.IsReset) this.ticketnotification = res.map((o: any) => this.ListNotificationDetails(o));
        else res.forEach((o: any) => this.ticketnotification.push(this.ListNotificationDetails(o)));

        this.prop.IsEmpty = (this.ticketnotification.length < 1);
        if (callback != null) callback();
        this.loader = false;
        this.lastnotificationid = this.ticketnotification[0].NotificationID;
        bindLastLastNotificatioinID(this.lastnotificationid);
        console.log('this.ticketnotification 196', this.ticketnotification)
        return this.ticketnotification;
      }

    });

    return this.ticketnotification;
  }
  ListNotificationDetails(item: any) {
    item.showMarkasRead = true;
    return item;
  }

  private async stompWebsocketReceiver() {
    this.input = await jUser();
    console.log('Overview Page Component connected', this.input)
    console.log('Overview Page Component this.subs', this.subs)
    var iscom = (this.input.isCommunicator == true) ? 1 : 0;
    var isdepthead = (this.input.isDeptartmentHead == true) ? 1 : 0;
    console.log(`/forwarded/depthead/${isdepthead}`);
    this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
    this.subs.wsDisconnect = stomp.subscribe('#disconnect', () => this.disconnect());
    this.subs.ws1 = stomp.subscribe('/' + iscom + '/ticketrequest/iscommunicator', (json: any) => this.receivedRequestTicketCommunicator(json));
    this.subs.ws1 = stomp.subscribe('/forwardticket/depthead/' + isdepthead, (json: any) => this.receivedforwardedTicket(json));
    this.subs.ws1 = stomp.subscribe('/assigned', (json: any) => this.receivedAssignedTicket(json));
    stomp.ready(() => (stomp.refresh(), stomp.connect()));
  }
  receivedAssignedTicket(data: any) {
    var content = data.notification;
    let notificationid = content.NotificationID
    bindLastLastNotificatioinID(content.NotificationID);
    this.refreshTicketList(content);
    if (this.input.LastNotificationID == content.NotificationID) return this.ticketnotification;
    additionalRequestNotification(1);
    this.refreshData();
    return this.ticketnotification;
  }
  receivedforwardedTicket(data: any) {
    var content = data.notification;
    let notificationid = content.NotificationID
    bindLastLastNotificatioinID(content.NotificationID);
    //if (this.input.LastNotificationID == content.NotificationID) return this.ticketnotification;
    this.refreshTicketList(content);
    //this.ticketnotification.unshift(content);
    console.log('this.ticketnotification 223', this.ticketnotification);
    /*
    let Exist = this.ticketnotification.find((o: any) => o.NotificationID == notificationid);

    this.ticketnotification.forEach((o: any) => {
      this.ticketnotificationReceived.push(this.ListNotificationDetails(o));
    });
    this.ticketnotification = [];
    this.ticketnotificationReceived.unshift(content);
    this.ticketnotificationReceived.forEach((o: any) => {
      this.ticketnotification.push(this.ListNotificationDetails(o));
    })
    this.ticketnotificationReceived = [];
    console.log('this.ticketnotification 223', this.ticketnotification);
    */
    if (this.input.LastNotificationID == content.NotificationID) return this.ticketnotification;
    additionalRequestNotification(1);
    this.refreshData();
    //this.ticketnotification = [];
    return this.ticketnotification;
  }

  notif: number = 201;
  hFind() {
    //let Exist = this.ticketnotification.find((o: any) => o.NotificationID == '16');
    //console.log('let ticketnotificationExist', Exist);
    //this.ticketnotification.unshift(this.lst);
    this.notif = this.notif + 1;
    this.lst.notification.NotificationID = this.notif;
    console.log('hFind', this.lst.notification)
    this.receivedforwardedTicket(this.lst)
  }
  lst: any = {
    type: 'departmenthead-notification',
    content: '',
    notification: {
      NotificationID: 201,
      DateTransaction: 'June 27, 2024',
      TransactionNo: '0000002010',
      Title: 'Notification Title',
      Description: 'Description Notification',
      IsOpen: false,
      Type: 'Forward-Ticket',
      DateDisplay: 'June 27, 2024',
      TimeDisplay: '09:36 AM',
      FulldateDisplay: 'June 27, 2024 09:36 AM'
    }

  }

  receivedRequestTicketCommunicator(data: any) {

    // console.log('receivedRequestTicketCommunicator', data);
    // var notification = data.notification;
    // this.lastnotificationid = notification.NotificationID;
    // //console.log('this.TicketNo 296', this.input.LastTransactionNo);
    // if (this.input.LastNotificationID == notification.NotificationID) return;

    // //console.log('this.TicketNo 299', content.TransactionNo);
    // bindLastNotificationID(this.notificationID);
    // additionalRequestNotification(1);
    // this.refreshData();
    // return this.input.RequestNotificationCount;


    var content = data.notification;
    //this.TicketNo = content.TicketNo;
    console.log('Communication Page var content 204', content);
    console.log('Communication Page content.NotificationID 208', content.NotificationID);
    let notificationid = content.NotificationID
    console.log('Communication Page notificationid 208', notificationid);
    console.log('this.input', this.input);
    bindLastLastNotificatioinID(content.NotificationID);
    if (this.input.LastNotificationID == content.NotificationID) return;
    //this.collections.push(data.content);
    let Exist = this.ticketnotification.find((o: any) => o.NotificationID == notificationid);
    console.log('let ticketnotificationExist', Exist);
    //if(Exist) return;

    this.ticketnotification.forEach((o: any) => {
      this.ticketnotificationReceived.push(this.ListNotificationDetails(o));
    });
    this.ticketnotification = [];
    this.ticketnotificationReceived.unshift(content);

    //this.collections = this.collectionreceived.map((o: any) => this.collectionListDetails(o));
    this.ticketnotificationReceived.forEach((o: any) => {
      this.ticketnotification.push(this.ListNotificationDetails(o));
    })
    this.ticketnotificationReceived = [];
    //this.ticketnotification.unshift(content);
    console.log('this.ticketnotification 223', this.ticketnotification);
    additionalRequestNotification(1);
    this.refreshData();
    return this.ticketnotification;


  }
  private async refreshData() {
    //jUserModify();
    this.input = await jUser();
    this.unreadNotification = await this.input.RequestNotificationCount;
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
    console.log('Overview Page Component connected')
    this.ping(() => this.testPing());
  }
  private stopPing() {
    const { subs } = this;
    const { tmPing, ping } = subs;
    if (tmPing) tmPing.unsubscribe();
    if (ping) ping.unsubscribe();
  }



}
