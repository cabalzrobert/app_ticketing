import { Component, OnInit, input } from '@angular/core';
import { additionalRequestNotification, bindLastNotificationID, jUser, jUserModify, requestnotificationCount } from '../../+app/user-module';
import { device } from '../../tools/plugins/device';
import { stomp } from '../../+services/stomp.service';
import { Capacitor } from '@capacitor/core';
import { rest } from '../../+services/services';
import { timeout } from '../../tools/plugins/delay';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { mtCb } from '../../tools/plugins/static';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss'
})
export class OverviewPageComponent implements OnInit {
  constructor(public router: Router) { }
  hViewSubmittedTickets() {
    this.router.navigateByUrl('dashboard/ticket');
  }
  hViewAssignedTickets() {
    this.router.navigateByUrl('dashboard/assignedticket');
  }
  loader = true;
  subs: any = {};
  input: any = {};
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
  notificationID:string = '';


  async ngOnInit(): Promise<void> {
    //console.log('Overview', Capacitor.platform);
    //console.log('ngOnInit this', this);
    device.ready();
    // this.subs.u = jUserModify(async () => {
    //   const u: any = await jUser();
    //   console.log('ngOnInt const u 80', u);
    //   Object.assign(this.input, u);
    //   console.log('ngOnInt this.input 1', this.input);

    // });
    //console.log('ngOnInt this.subs 1', this.subs);
    this.input = await jUser();
    device.ready(async () => requestnotificationCount());
    device.ready(() => this.stompWebsocketReceiver());
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
    //timeout(() => this.getTicketListDelay({IsRest: true}), 1275);

    //timeout(() => this.getTicketList({IsRest: true}), 275);
    await this.getTicketList({IsRest: true});

    //this.getTicketListDelay({ IsReset: true }, mtCb, 1275);
    console.log('ngOnInit this.ticketnotification', this.input);
    
    console.log('this.ticketnotification 84', this.ticketnotification);
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
    this.subs.t1 = timeout(() => this.getTicketList(filter, callback), delay);
  }

  getTicketList(item: any, callback: Function = mtCb): Observable<any> {
    if (!this.subs) return this.ticketnotification;
    if (this.subs.s1) this.subs.s1.unsubscribe();

    this.subs.s1 = rest.post('notification', item).subscribe(async (res: any) => {
      console.log('notificaiton res', res);
      if (res != null) {
        var cnt = parseInt(res.length);
        console.log('Ticket List 1786', cnt);
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
        return this.ticketnotification;
      }

    });
    
    return this.ticketnotification;
  }
  ListNotificationDetails(item: any) {
    console.log('ListNoftificationDetails itme', item);
    return item;
  }

  private async stompWebsocketReceiver() {
    this.input = await jUser();
    console.log('Overview Page Component connected', this.input)
    console.log('Overview Page Component this.subs', this.subs)
    var iscom = (this.input.isCommunicator == true) ? 1 : 0;
    this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
    this.subs.wsDisconnect = stomp.subscribe('#disconnect', () => this.disconnect());
    this.subs.ws1 = stomp.subscribe('/' + iscom + '/ticketrequest/iscommunicator', (json: any) => this.receivedRequestTicketCommunicator(json));
    stomp.ready(() => (stomp.refresh(), stomp.connect()));
  }




  receivedRequestTicketCommunicator(data: any) {
    var notification = data.notification;
    this.notificationID = notification.NotificationID;
    //console.log('this.TicketNo 296', this.input.LastTransactionNo);
    if (this.input.LastNotificationID == notification.NotificationID) return;

    //console.log('this.TicketNo 299', content.TransactionNo);
    bindLastNotificationID(this.notificationID);
    additionalRequestNotification(1);
    this.refreshData();
    return this.input.RequestNotificationCount;
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
