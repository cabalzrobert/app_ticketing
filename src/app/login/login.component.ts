import { Component, NgZone, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { rest } from '../+services/services';
import { device } from '../tools/plugins/device';
import { LocalStorageService } from '../tools/plugins/localstorage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, public ls: LocalStorageService, private zone:NgZone) { }
  account: any = [];
  ngOnInit(): void {
    //console.log('login.components.ts ngOnit');
    //setTimeout(() => this.performCheckDB(), 750);
    
    device.ready(() => this.sessionNotEmpty());
    device.ready(() => this.performCheckDB());
    
  }

  private performCheckDB() {
    //console.log('performCheckDB');
    try {
      rest.post('dashboardticketing', {}).subscribe(async (res: any) => {
        //console.log('performCheckDB', res);
        //console.log('performCheckDB device.isBrowser', device.isBrowser);
        if (res.Result == 'ok') {
          //console.log('Session', localStorage.getItem('Auth'));
          //
          if (this.sessionNotEmpty1()) {
            let strUrl = window.location.href + '';
            console.log('Windows.Location', strUrl);
            //window.location.href = strUrl;
            //this.zone.run(() => this.router.navigateByUrl('/dashboard'));
            this.zone.run(() => window.location.reload());
            //window.open(strUrl);
          }
          else
            this.dbIsEmpty(true);
        }
        else
          this.dbIsEmpty(false)
      });
    } catch {
      //this.dbIsEmpty(false);
      //console.log('ERROR');
    }



    // this.apiservice.loadSubscriberList('dashboardticketing',{}).subscribe(async(res:any) => {
    //   console.log('performCheckDB res', res);
    // });

    /*
    this.apiservice.loadSubscriberList('dashboardsignin02',{Username: 'Brgy. Lahug', password: 'RXNhdEAxMjM0NTY='}).subscribe(async(res:any) => {
      console.log('performCheckDB res', res);
    });
    */

  }
  dbIsEmpty(_isEmpty: boolean) {
    if (_isEmpty == true) {
      console.log('dbIsEmpty', !_isEmpty)
      this.zone.run(() => this.router.navigateByUrl('/login'));
    }
    else {
      this.zone.run(() => this.router.navigateByUrl('/headquarter'));
    }
  }
  sessionNotEmpty() {
    if (this.authService.session) {
      //console.log('SessionNotEmpty', this.authService.session, this.router);
      this.zone.run(() => this.router.navigateByUrl('/dashboard'));
    }
    
  }
  sessionNotEmpty1(): boolean {
    //console.log('sessionNotEmpty this.authService.session', this.authService.session);
    if (this.authService.session) return true;
    console.log('sesseionNotEmpty landing.component.ts line 54');
    return false;
  }
  login = async () => {
    //console.log('You Click Login Button');
    //var user = this.authService.login(this.form.value.username, this.form.value.password);
    //var user = setTimeout(() => this.authService.login(this.form.value.username, this.form.value.password), 750);

    var user = await this.authService.ticketlogin({ Username: this.form.value.username, Password: this.form.value.password });


    //this.account =user.next(user.account);
    console.log('this.account at login.component.ts', user);

    if (!user) {
      alert('Invalid username or password');

    }
    else {
      console.log('this.account at login.component.ts inside if else statemet', user);
      this.zone.run(() => this.router.navigate(['/']));
      //window.location.reload();
    }
  }
}
