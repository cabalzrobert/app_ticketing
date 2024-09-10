import { Injectable, InjectionToken, inject } from '@angular/core';
import { rest } from './+services/services';

import { storage } from './tools/plugins/storage';
import { jUser } from './+app/user-module';
import { LocalStorageService } from './tools/plugins/localstorage'
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { state } from '@angular/animations';
import { AsyncSubject, Observable, Subject } from 'rxjs';
import { isPassword } from './tools/global';
import { device } from './tools/plugins/device';
import { stomp } from './+services/stomp.service';
import { timeout } from './tools/plugins/delay';
import { WebSocketService } from './web-socket.service';
//const{ Object }:any = window;

//const { ls }: any = LocalStorageService;

interface MyWindow extends Window {
  myFunction(): void;
}
interface Window {
  Object: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users: any[] = [
    {
      id: 1,
      name: 'David',
      username: 'david',
      password: 'abc'
    },
    {
      id: 2,
      name: 'XYS',
      username: 'xyz',
      password: 'abc'
    }
  ];
  account: any = [];
  session: any;
  input: any = {};
  authentication: any;
  retres: any = {};
  departmentlist: any = [];
  categorylist: any = [];
  positionlist: any = [];
  roleslist: any = [];
  _menutab:any = [];
  subs: any = {};
  prop: any = {};
  requesttickect: any = {};
  constructor(private router: Router, public ls: LocalStorageService, private websocketservice: WebSocketService) {
    //let session: any = localStorage.getItem('Auth');
    let session: any = this.ls.getItem1('Auth');
    if (session) {
      session = JSON.parse(session);
      //device.ready(() => setTimeout(() => this.performAuth(), 275));

      this.stompWebsocketReceiver();
      //session = session
    }
    this.session = session;
  }



  performAuth = async () => {
    var isSignIn = await this.ls.getItem1('IsSignin')
    let token: any = this.ls.getItem1('Auth');
    //console.log('perfomAuth token.Token', token.Token);
    rest.setBearer(JSON.parse(token).Token);
    this.input = await jUser();
    return setTimeout(() => {
      if (isSignIn) {
        //this.stompWebsocketReceiver();
        this.router.navigateByUrl('/');
      }

      else
        this.router.navigateByUrl('/login');
    });

  }

  private stompWebsocketReceiver() {
    this.websocketservice.stompWebsocketReceiver();
    // console.log('stompWebsocketReceiver auth.service.ts');
    // var iscom = this.input.isCommunicator ? 1 : 0;
    // this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    // this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
    // this.subs.wsDisconnect = stomp.subscribe('#disconnect', () => this.disconnect());

    // //this.subs.ws1 = stomp.subscribe('/test', (json: any) => this.ReceivedTest(json));
    // this.subs.ws1 = stomp.subscribe('/test/notify', (json: any) => this.receivedNotify(json));
    // this.subs.ws1 = stomp.subscribe('/ticketrequest/iscommunicator', (json: any) => this.receivedRequestTicketCommunicator(json));
    // this.subs.ws1 = stomp.subscribe('/'+ iscom + '/ticketrequest/iscommunicator', (json: any) => this.receivedRequestTicketCommunicator(json));
    // //console.log('stompReceiver this.subs', this.subs);
    // //stomp.connect();
    // stomp.ready(() => (stomp.refresh(), stomp.connect()));
    // console.log('stompWebsocketReceiver aut.service.ts');
  }
  receivedRequestTicketCommunicator(data: any) {
    console.log('Received Ticket of Communicator Account', data);
  }
  private error() {
    this.ping(() => this.testPing());
  }
  private ReceivedTest(data: any) {
    console.log('Received Test', data);
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
      console.log('logNotify res', res);
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

  login(username: string, password: string): any {
    let user = this.users.find((u) => u.username === username && u.password === password);
    if (user) {
      this.session = user;
      //localStorage.setItem('Auth', JSON.stringify(this.session));
      this.ls.setItem('Auth', JSON.stringify(this.session));
    }
    return user;

  }
  logout() {
    this.session = undefined;
    //localStorage.removeItem('Auth');
    //localStorage.clear();
    this.ls.clear();
    //window.localStorage.clear();
    this.router.navigateByUrl('/');
  }
  ticketlogin(input: any): Observable<any> {

    rest.post('dashboardsignin', input).subscribe(async (res: any) => {
      //console.log('Process the Login API');
      if (res.Status == 'ok') {
        var auth = res.auth;
        this.session = JSON.stringify(auth);
        this.account.push(res.account)

        this.performSaveLocal(res.account, res.auth, input.Username)
      }
      else {
        alert(res.message);
      }
    }, (err: any) => {
      //alert('Invalid Username and Password');
    });
    //console.log('ticketlogin this.acocunt', this.account);
    return this.account;
  }

  public performSaveLocal(account: any, auth: any, username: string) {
    //console.log('performSaveLocal Login auth.Token', auth.Token);
    rest.setBearer(auth.Token);
    this.ls.setItem('Auth', JSON.stringify(auth));
    this.ls.setItem('UserAccount', JSON.stringify(account));
    this.ls.setItem('Username', username);
    this.ls.setItem('IsSignin', String(true));

    jUser(Object.assign(account));
    //console.log('Perform Save Local', jUser(Object.assign(account)));
    //console.log('Login PerformSaveLocal', auth.Token);
  }
  SaveHeadOffice(_ho: any) {
    if (!_ho.HeadOfficeName.isEmpty()) {
      return true;
    }
    return false;
  }

  GetDepartmentList(item: any): Observable<any[]> {
    rest.post('department/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.departmentlist = res.department;
        //this.departmentlist;
      }
    });
    return this.departmentlist;
  }
  GetCategoryList(item: any): Observable<any> {

    rest.post('category/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.categorylist = res.category;
        console.log('GetCategoryList inside subscribe', this.categorylist);
        return this.categorylist;
        //this.categorylist;
      }
    });
    return this.categorylist;
  }

  private stompReceivers() {
    //this.subs.ws1 = stomp.subscribe('/notify', (json: any) => this.receivedNotify(json));
  }
  private async receivedNotify(data: any) {
    //console.log('receivedNotify', data);
    // if (data.type == 'load-credit' || data.type == 'credit-approval') {
    //     await this.refreshData();
    // } else if (data.type == 'add-commission') {
    //     if (this.state.u.IsPlayer) return;
    //     await this.refreshData();
    // } else if (data.type == 'post-notification') {
    //     await jAnnouncement({
    //         Title: data.Title,
    //         Description: data.Description
    //     }, true)
    // }

    /*
    else if(data.type == 'app-update'){
        await this.deviceSessionEnd();
    }
    */
  }
}
