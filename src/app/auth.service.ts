import { Injectable, InjectionToken, inject } from '@angular/core';
import { rest } from './+services/services';

import { storage } from './tools/plugins/storage';
import { jUser } from './+app/user-module';
import { LocalStorageService } from './tools/plugins/localstorage'
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { state } from '@angular/animations';
import { Subject } from 'rxjs';
import { isPassword } from './tools/global';


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
  constructor(private router: Router, public ls: LocalStorageService) {
    let session: any = localStorage.getItem('Auth');
    if (session) {
      session = JSON.parse(session);
      //session = session
    }
    this.session = session;
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
    localStorage.removeItem('Auth');
    this.router.navigateByUrl('/');
  }
  ticketlogin(input: any): any {

    rest.post('dashboardsignin', input).subscribe(async (res: any) => {
      console.log('Process the Login API');
      if (res.Status == 'ok') {
        var auth = res.auth;
        this.session = JSON.stringify(auth);
        this.account.push(res.account)
        
        this.performSaveLocal(res.account, res.auth, input.Username)
      }
    }, (err: any) => {
      alert(err.Message);
    });
    return this.account;
  }
  private performSaveLocal(account: any, auth: any, username: string) {
    jUser(Object.assign(account));
    rest.setBearer(auth.Token);
    this.ls.setItem('Auth', JSON.stringify(auth));
    this.ls.setItem('UserAccount', JSON.stringify(account));
    this.ls.setItem('Username', username);
    this.ls.setItem('IsSignin', String(true));
  }
  SaveHeadOffice(_ho: any) {
    if (!_ho.HeadOfficeName.isEmpty()) {
      return true;
    }
    return false;
  }
}
