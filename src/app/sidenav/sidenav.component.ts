import { Component, Output, EventEmitter, OnInit, HostListener, input, inject, ElementRef } from '@angular/core';
import { navbarData, navbarDataCommunicator, navbarDataCommunicatorDepartmentHead, navbarDataDepartmentHead, navbarDataPersonnel, navbarDataUser } from './nav-data';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../auth.service';
import { rest } from '../+services/services';
import { timeout } from '../tools/plugins/delay';
import { jUser, jUserModify, additionalNotification, notificationCount, getLastTransactionNumber, bindLastTransacationNumber } from '../+app/user-module';
import { device } from '../tools/plugins/device';
import { LocalStorageService } from '../tools/plugins/localstorage';
import { stomp } from '../+services/stomp.service';
//import { WebSocketService } from '../web-socket.service';
import { filter, Observable, Subject, Subscription } from 'rxjs';
import { WebSocketService } from '../web-socket.service';
import { RxStompService } from '../tools/plugins/rx-stomp.service';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { subscribe } from 'diagnostics_channel';
import { RxStomp } from '@stomp/rx-stomp';
import React from 'react';
import { json } from 'stream/consumers';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileComponent } from '../admin/profile/profile.component';
import { SubmitModalComponent } from '../admin/modalpage/submit-modal/submit-modal.component';
import { AlertSuccessModalComponent } from '../admin/modalpage/alert-success-modal/alert-success-modal.component';
//import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
//const { Object }: any = window;
interface SideNavToggle {
  screenWidth: number;
  screenHeight: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350s',
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350s',
          style({ opacity: 0 })
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {
  hMouseOut() {
    if (window.innerWidth > 768) return;
    if (!this.collapsed)
      this.collapsed = true;
    else if (this.collapsed)
      this.collapsed = false;
  }
  hMouseOver() {
    if (window.innerWidth > 768) return;
    if (!this.collapsed)
      this.collapsed = true;
    else if (this.collapsed)
      this.collapsed = false;
  }
  hClearRequest() {
    this.authService.requesttickect = {};
  }
  submitDialogRef?: MatDialogRef<SubmitModalComponent>;
  successDialogRef?: MatDialogRef<AlertSuccessModalComponent>;
  logout() {
    //this.authService.logout();
    //this.stopPing();
    let strheader: string = 'Logout';
    let strcontent: string = 'Are you sure you want to logout?'
    this.submitDialogRef = this.dialog.open(SubmitModalComponent, { data: { item: { Header: strheader, Message: strcontent } } });
    this.submitDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
      if (o.item.isConfirm) {
        this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-check', Message: 'Logout Successfully', ButtonText: 'Logout', isConfirm: true } } });
        this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
          this.ls.clear();
          window.location.reload();
        });
      }
    });

  }

  totalticketreceived: number = 0;
  constructor(public router: Router, private authService: AuthService,
    private ls: LocalStorageService,
    //public webSocketService: WebSocketService, 
    private rxStompService: RxStompService,
    private dialog: MatDialog
  ) {

    device.ready(() => this.stompWebsocketReceiver());
    //this.webSocketService.stompWebsocketReceiver();
    this.totalticketreceived = this.totalticketreceived;
  }
  public response = (data: any) => {
    //console.log(data)
  }
  @HostListener('window:resize', ['$event'])
  onWindowInitialize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    
    this.authService.sizeWidth = `${window.innerWidth} px`;
    this.authService.sizeHeight = `${window.innerHeight} px`;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth, screenHeight: this.screenHeight });
    }
    else {
      this.collapsed = true;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth, screenHeight: this.screenHeight });
    }
    // this.collapsed = true;
    //   this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  onResize(event: any) {
    //console.log('onResize', window.innerWidth);
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth, screenHeight: this.screenHeight });
    }
    else {
      this.collapsed = true;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth, screenHeight: this.screenHeight });
    }
  }
  subs: any = {};
  prop: any = {};
  input: any = {};
  receivedMessages: any = [];
  TicketNo: string = '';
  ticketNo: string = '';

  async ngOnInit(): Promise<void> {
    //this.webSocketService.token();
    //this.webSocketService.stompWebsocketReceiver();
    //console.log('sidenav component');
    //Object = {window};
    //this.navData = navbarData;

    //device.ready(() => this.stompWebsocketReceiver());
    //this.webSocketService.stompWebsocketReceiver();
    this.input = await jUser();
    //console.log('account',input);
    //console.log('this.input 96', this.input);
    //device.ready(async () => (await departmentnotificationCount)());

    this.NavBarItem();;

    device.ready(() => notificationCount());
    getLastTransactionNumber();

    //this.subs.u = jUserModify(async () => this.setState({u:await jUser()}));
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth <= 768)
      this.collapsed = false;
    else
      this.collapsed = true;

    //console.log('NavBarItem', this.screenWidth, this.collapsed);
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth, screenHeight: this.screenHeight });
    device.ready();
    //console.log('Device is isReady ', device.ready());
    //console.log('Device is Browser ', device.isBrowser);
    let auth: any = this.ls.getItem1('Auth');
    if (!!auth) {
      //console.log('auth is not empty', JSON.parse(auth));
      rest.setBearer((JSON.parse(auth).Token));
    }
    //this.stompReceivers();
    //rest.ready(() => this.stompWebsocketReceiver());
    //this.stompWebsocketReceiver();

    this.onWindowInitialize();
    //console.log('This is input 129', this.input);
    // this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
    //   this.previousUrl = this.currentUrl;
    //   this.currentUrl = event.url;

    //   console.log('URL', this.router.url);
    //   console.log('URL SPLIT', this.router.url.split('/')[2]);

    //   console.log('Sidenav Previous URL:', this.previousUrl);
    //   console.log('Sidenav Current URL:', this.currentUrl);

    // });

    //console.log('URL', this.router.url);
    //console.log('URL SPLIT', this.router.url.split('/')[2]);
    let tab = this.router.url.split('/')[2];
    let isAccess: boolean = false;
    this.authService._menutab.forEach((o: any) => {
      if (o.routerLink == tab)
        isAccess = true
    });
    if (isAccess)
      console.log('You have access on this tab', tab);
    else {

      this.router.navigateByUrl('/dashboard');
      //console.log('You dont have access on this tab', tab);
      //this.router.navigateByUrl('/overview');
    }


  }
  currentUrl: string = '';
  previousUrl: string = '';

  onSendMessage() {
    const message = `Message generated at ${new Date()}`;
    this.rxStompService.publish({ destination: '/ticketrequest/iscommunicator', body: message });
  }
  loadHome() {
    this.router.navigateByUrl('/dashboard');
  }
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  collapsed = false;
  screenWidth = 0;
  screenHeight = 0;
  //navData = navbarData;
  navData: any = [];

  toggleCollapse(): void {
    console.log('Collapsed Sidenav', this.collapsed)
    if (!this.collapsed)
      this.collapsed = !this.collapsed;
    else
      this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth, screenHeight: this.screenHeight });
  }
  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth, screenHeight: this.screenHeight });
  }

  private async NavBarItem() {
    // console.log('Navigational Bar this.input', this.input);

    // if (this.input.ACT_TYP == 1 || this.input.ACT_TYP == 2) {
    //   this.navData = navbarData;
    // }
    // else {
    //   if (this.input.isCommunicator == true && this.input.isDeptartmentHead == false) {
    //     this.navData = navbarDataCommunicator;
    //   }
    //   else if (this.input.isCommunicator == false && this.input.isDeptartmentHead == true) {
    //     this.navData = navbarDataDepartmentHead;
    //   }
    //   else if (this.input.isCommunicator == true && this.input.isDeptartmentHead == true) {
    //     this.navData = navbarDataCommunicatorDepartmentHead;
    //   }
    //   else if (this.input.isCommunicator == false && this.input.isDeptartmentHead == false) {
    //     this.navData = navbarDataUser;
    //   }
    // }

    // if (this.input.ACT_TYP == 4) this.navData = navbarDataCommunicator;
    // else if (this.input.ACT_TYP == 5) this.navData = navbarDataDepartmentHead;
    // else if (this.input.ACT_TYP == 6) this.navData = navbarDataPersonnel;
    // else this.navData = navbarData;

    if (this.input.ACT_TYP == 2) {
      this.navData = navbarData;
      this.authService._menutab = this.navData;
    }
    else
      await this.getUserAccessProfile();
    //console.log('NavData', this.navData);



    //console.log('Navigational Bar', this.navData);
  }
  todos: string[] = [];
  isConnected: boolean = false;
  totalUnsolvedTickets: number = 0;
  getUserAccessProfile(): Observable<any> {
    rest.post('useraccess/getuseraccess').subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.navData = JSON.parse(res.useraccess[0].MenuTab);
        console.log('getUserAccessProfile NavData', JSON.parse(res.useraccess[0].MenuTab));
        console.log('label',this.navData);
        if(this.navData.find((o:any)=> o.label === 'Tickets')) { this.getTicketCount('communicator/count');}
        else if (this.navData.find((o:any)=> o.label === 'Assigned Tickets')) {this.getTicketCount(`head/ticket/count?departmentID=${this.input.DEPT_ID}`);}
        else {this.getTicketCount(`user/ticket/count?departmentID=${this.input.DEPT_ID}`);}
        return this.navData;
      }
    });
    return this.navData
  }

  getTicketCount(path: string) {
    rest.post(path).subscribe(async (res: any) => {
      this.totalUnsolvedTickets = Number(res.TicketCount.UnsolvedTickets);
      console.log('total tickets',res.TicketCount,'path',path);
      return;
    });
  }

  private stompReceivers() {
    console.log('sidenav.components.ts stompReceivers')
    const rxStomp = new RxStomp();
    rxStomp.configure({
      brokerURL: rest.ws('ws', true),
      debug: function (str) {
        console.log('STOMP: ', str);
      },
    });
    rxStomp.activate();
    rxStomp.connected();
    const subscription = rxStomp
      .watch({ destination: "/test" })
      .subscribe((message) => console.log(message.body));

    console.log('subscription', subscription);
    rxStomp.publish({
      destination: "/test",
      body: "First message to RxStomp",
    });

    const subscriptionc = rxStomp
      .watch({ destination: "/ticketrequest/iscommunicator" })
      .subscribe((message) => console.log(message.body));

    console.log('subscription', subscriptionc);
    rxStomp.publish({
      destination: "/ticketrequest/iscommunicator",
      body: "First message to RxStomp",
    });
    // setTimeout(async () => {
    //   subscription.unsubscribe();
    //   await rxStomp.deactivate();
    // }, 3000);
    console.log('rxStomp', rxStomp);

    //this.webSocketService.connect();


    // let auth: any = this.ls.getItem1('Auth');
    // if (auth != '') {
    //   console.log('auth is not empty');
    //   rest.setBearer(JSON.parse(auth).Token);
    // }
    // console.log('stompReceivers rest.ws 112', rest.ws('ws', true));
    // this.webSocketService.socket$ = webSocket(rest.ws('ws', true));
    // // console.log('stompReceiver this.webSocketService.socket$', this.webSocketService.socket$);

    // this.webSocketService.socket$.subscribe(
    //   (message:any) => {
    //     this.isConnected = true;
    //     this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    //     this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
    //     var arrTodo: string[] = [];
    //     message.forEach((element: any) => {
    //       arrTodo.push(element.replace("\"", "").replace("\"", ""))
    //     });
    //     console.log(arrTodo);
    //     this.todos = arrTodo;
    //   },
    //   (error:any) => console.error('WebSocket error:', error),
    //   () => {
    //     this.isConnected = false;
    //     console.log('WebSocket connection closed');
    //   }
    // );
    // this.onSendMessage();
    // this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    // this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());

    // this.subs.ws1 = stomp.subscribe('/test', (json: any) => this.ReceivedTest(json));
    // this.subs.ws1 = stomp.subscribe('/notify', (json: any) => this.receivedNotify(json));
    // this.subs.ws3 = stomp.subscribe('/ticketrequest/iscommunicator', (json: any) => this.receivedRequestTicketCommunicator(json));
    // console.log('stompReceiver this.subs', this.subs);
  }
  private async receivedNotify(data: any) {
    //console.log('receivedNotify', data);
    //this.totalticketreceived = this.totalticketreceived + 1;
    //console.log('total ticket Received ', this.totalticketreceived);

    additionalNotification(1);
    //alert('receivedNotify ' + JSON.stringify(data));
    //console.log('receivedNotify input 243', this.input);
    this.totalticketreceived = 1;

    this.refreshData();
  }

  private async stompWebsocketReceiver() {
    //this.webSocketService.connect();
    this.input = await jUser();
    var iscom = (this.input.isCommunicator == true) ? 1 : 0;
    var isdepthead = (this.input.isDeptartmentHead == true) ? 1 : 0;
    //console.log('stompWebsocketReceiver');
    this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
    this.subs.wsDisconnect = stomp.subscribe('#disconnect', () => this.disconnect());
    this.subs.ws1 = stomp.subscribe('/test/notify', (json: any) => this.receivedNotify(json));
    //console.log('this.input.iscommunictor', this.input.isCommunicator);

    //this.subs.ws1 = stomp.subscribe('/1/ticketrequest/iscommunicator', (json: any) => this.receivedRequestTicketCommunicator(json));
    this.subs.ws1 = stomp.subscribe('/' + iscom + '/ticketrequest/iscommunicator', (json: any) => this.receivedRequestTicketCommunicator(json));
    this.subs.ws1 = stomp.subscribe('/forwardticket/depthead/' + isdepthead, (json: any) => this.receivedforwardedTicket(json));
    this.subs.ws1 = stomp.subscribe('/forwardticket', (json: any) => this.receivedRequestTicketCommunicator(json));
    this.subs.ws1 = stomp.subscribe(`/requestorhead`, (json: any) => this.notifyRequest(json));
    this.subs.ws1 = stomp.subscribe('/assigned', (json: any) => this.notifyAssignee(json));
    this.subs.ws1 = stomp.subscribe(`/return`, (json: any) => this.notifyReturn(json));
    this.subs.ws1 = stomp.subscribe('/resolve', (json: any) => this.notifyApproval(json));
    this.subs.ws1 = stomp.subscribe(`/countticket`, (json: any) => this.notifyTicketCounter(json));
    stomp.ready(() => (stomp.refresh(), stomp.connect()));
    //console.log('stompWebsocketReceiver 250 sidenav.components', this.subs);
  }

  notifyRequest(data:any){
    console.log('notifyRequest',data.content);
    if(!data.content || data.content === undefined){
      console.log('no data');
      return;
    }
    this.totalUnsolvedTickets = this.totalUnsolvedTickets + 1;
  }

  notifyAssignee(data:any){
    console.log('notifyAssignee',data.content);
    if(!data.content || data.content === undefined){
      console.log('no data');
      return;
    }

    this.totalUnsolvedTickets = this.totalUnsolvedTickets + 1;
    console.log('my task pending tickets',this.totalUnsolvedTickets);
  }
  
  notifyReturn(data:any){
    console.log('notifyReturn',data.content);
    if(!data.content || data.content === undefined){
      console.log('no data');
      return;
    }
    
  }
  
  notifyApproval(data:any){
    console.log('notifyApproval',data.content);
    if(!data.content || data.content === undefined){
      console.log('no data');
      return;
    }

    if(data.content.ticketStatusId === 1 || (data.content.status !== 1 && data.content.ticketStatusId === 4))
      this.totalUnsolvedTickets = this.totalUnsolvedTickets - 1;
  }

  notifyTicketCounter(data:any){
    console.log('notifyTicketCounter',data.content);
    if(!data.content || data.content === undefined){
      console.log('no data');
      return;
    }
    if(data.content.action === "decrement")
      this.totalUnsolvedTickets = this.totalUnsolvedTickets - Number(data.content.counter);
  }

  receivedRequestTicketCommunicator(data: any) {
    console.log('sidenav forwardticket received',data.content);
    //console.log('Received Ticket of Communicator Account', data);
    // var content = data.content;
    // if (this.TicketNo == content.TicketNo) {
    //   this.TicketNo = content.TicketNo;
    //   console.log('equal this.TicketNo 274', this.TicketNo);
    //   console.log('content.TicketNo 275', content.TicketNo);
    //   return;
    // }
    // else{
    //   this.TicketNo = content.TicketNo;
    //   console.log('equal this.TicketNo 280', this.TicketNo);
    //   console.log('content.TicketNo 281', content.TicketNo);
    //   console.log('not equal this.TicketNo 282', this.TicketNo);
    //   additionalNotification(1);
    //   console.log(' additionalNotification(1)', this.input.NotificationCount);
    // }
    // // if (this.TicketNo != content.TicketNo) {
    // //   this.TicketNo = content.TicketNo;
    // //   console.log('not equal this.TicketNo', this.TicketNo);
    // //   additionalNotification(1);
    // //   console.log(' additionalNotification(1)', this.input.NotificationCount);
    // // }



    // //var message = (content.Messages[0] || null);
    // console.log('receivedNotify input 267', this.input);

    var content = data.content;
    this.TicketNo = content.TicketNo;
    //console.log('this.TicketNo 296', this.input.LastTransactionNo);
    if (this.input.LastTransactionNo == content.TransactionNo) return;

    //console.log('this.TicketNo 299', content.TransactionNo);
    bindLastTransacationNumber(content.TransactionNo);
    additionalNotification(1);
    this.refreshData();
    return this.input.NotificationCount;
  }
  receivedforwardedTicket(data: any) {
    var content = data.content;
    this.ticketNo = content.ticketNo;
    if (this.input.LastForwardTransactionNo == content.transactionNo) return;
    console.log('Department Head Count Side Nav 329', content);
    //bindLastForwardTransactionNumber(content.transactionNo);
    return this.input.DepartmentHeadNotificationCount;

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
    this.ping(() => this.testPing());
  }
  private stopPing() {
    const { subs } = this;
    const { tmPing, ping } = subs;
    if (tmPing) tmPing.unsubscribe();
    if (ping) ping.unsubscribe();
  }

  profile() {
    // console.log('window.innerWidth', window.innerWidth);
    // if(window.innerWidth<=677){
    //   const dialogRef = this.dialog.open(ProfileComponent, {
    //     // maxHeight: '0%',
    //     height: '80%',
    //     width: '80%'
    //   })
    // }
    // else{
    //   const dialogRef = this.dialog.open(ProfileComponent, {
    //     // maxHeight: '0%',
    //     height: '80%',
    //     width: '50%'
    //   })
    // }

    const dialogRef = this.dialog.open(ProfileComponent, {
      // maxHeight: '0%',
      // height: '80%',
      // width: '679px',
      panelClass: 'full-screen-profile'
    });
    
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault(); // Prevent the default context menu from appearing
    //console.log('Right-click detected', event);
  }

}
