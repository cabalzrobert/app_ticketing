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
  authentication: any;
  retres: any = {};
  departmentlist: any = [];
  categorylist: any = [];
  positionlist: any = [];
  roleslist: any = [];
  subs: any = {};
  constructor(private router: Router, public ls: LocalStorageService) {
    let session: any = localStorage.getItem('Auth');
    if (session) {
      session = JSON.parse(session);
      device.ready(() => setTimeout(() => this.performAuth(), 275));
      //session = session
    }
    this.session = session;
  }

  performAuth = async () => {
    var isSignIn = await this.ls.getItem1('IsSignin')
    let token: any = this.ls.getItem1('Auth');
    //console.log('perfomAuth token.Token', token.Token);
    rest.setBearer(JSON.parse(token).Token);
    return setTimeout(() => {
      if (isSignIn)
        this.router.navigateByUrl('/');
      else
        this.router.navigateByUrl('/login');
    });

  }

  login(username: string, password: string): any {
    let user = this.users.find((u) => u.username === username && u.password === password);
    if (user) {
      this.session = user;
      localStorage.setItem('Auth', JSON.stringify(this.session));
    }
    return user;

  }
  logout() {
    this.session = undefined;
    //localStorage.removeItem('Auth');
    localStorage.clear();
    window.localStorage.clear();
    this.router.navigateByUrl('/');
  }
  ticketlogin(input: any): any {

    rest.post('dashboardsignin', input).subscribe(async (res: any) => {
      //console.log('Process the Login API');
      if (res.Status == 'ok') {
        var auth = res.auth;
        this.session = JSON.stringify(auth);
        this.account.push(res.account)

        this.performSaveLocal(res.account, res.auth, input.Username)
      }
    }, (err: any) => {
      alert(err.Message);
    });
    //console.log('ticketlogin this.acocunt', this.account);
    return this.account;
  }

  private performSaveLocal(account: any, auth: any, username: string) {
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
