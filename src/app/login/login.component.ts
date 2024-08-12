import { Component, NgZone, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { rest } from '../+services/services';
import { device } from '../tools/plugins/device';
import { LocalStorageService } from '../tools/plugins/localstorage';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertSuccessModalComponent } from '../admin/modalpage/alert-success-modal/alert-success-modal.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  async hReload() {
    if (await this.ls.getItem1('isReload') == null) {
      console.log('isReload is not defined');
      this.ls.setItem('isReload', '1');
      location.reload();
    }
    //window.location.reload();
  }
  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, public ls: LocalStorageService, private zone: NgZone, public dialog: MatDialog) { }
  account: any = [];

  successDialogRef?: MatDialogRef<AlertSuccessModalComponent>;
  screenWidth = 0;
  size = '';
  sizeWidth = '';
  sizeHeight = '';
  ngOnInit(): void {
    console.log('login.components.ts ngOnit');
    //setTimeout(() => this.performCheckDB(), 750);

    device.ready(() => this.sessionNotEmpty());
    device.ready(() => this.performCheckDB());
    console.log('hHideShowPassowrd', this.password);


  }
  onWindowInitialize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 768) {
      this.size = "600px";
      this.sizeWidth = `${window.innerWidth} px`;
      this.sizeHeight = `${window.innerHeight} px`;
      //this.onToggleHeadquarterComponent.emit({ screenWidth: this.screenWidth });
    }
    else {
      this.size = "";
      //this.onToggleHeadquarterComponent.emit({ screenWidth: this.screenWidth });
    }
    // this.collapsed = true;
    console.log('onWindowInitialize this.screenWidth', this.screenWidth);
    //this.onToggleHeadquarterComponent.emit({ screenWidth: this.screenWidth });
  }

  password: string = 'password';
  show:boolean=false;
  hHideShowPassword() {
    console.log('hHideShowPassowrd', this.password);
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
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
      }, (err: any) => {
        alert('System Error');
        this.router.navigateByUrl('/headquarter');
      });
    } catch {
      //this.dbIsEmpty(false);
      //console.log('ERROR');
      alert('System Error');
      //this.zone.run(() => this.router.navigateByUrl('/headquarter'));
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
      console.log('SessionNotEmpty', this.authService.session, this.router);
      this.zone.run(() => this.router.navigateByUrl('/'));
    }

  }
  sessionNotEmpty1(): boolean {
    //console.log('sessionNotEmpty this.authService.session', this.authService.session);
    if (this.authService.session) return true;
    console.log('sesseionNotEmpty landing.component.ts line 54');
    return false;
  }
  ticketlogin(input: any): any {

    rest.post('dashboardsignin', input).subscribe(async (res: any) => {
      //console.log('Process the Login API');
      if (res.Status == 'ok') {
        var auth = res.auth;
        this.authService.session = JSON.stringify(auth);
        this.account.push(res.account)

        this.authService.performSaveLocal(res.account, res.auth, input.Username)
        this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-check', Message: 'Login Successfully', ButtonText: 'Success', isConfirm: true } } });
        this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
          if (o.item.isConfirm) {
            this.hReload();
            //this.zone.run(() => this.router.navigate(['/dashboard']));
            //return;
          }
        });
      }
      else {
        this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-exclamation', Message: 'Invalid Username and Password', ButtonText: 'Error', isConfirm: false } } });
        this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
          if (o.item.isConfirm) {
            //this.hReload();
            return;
          }
        });
        return;
      }
    }, (err: any) => {
      //alert('Invalid Username and Password');
      this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-exclamation', Message: 'Invalid Username and Password', ButtonText: 'Error', isConfirm: false } } });
      this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
        if (o.item.isConfirm) {
          //this.hReload();
          return;
        }
      });
    });
    //console.log('ticketlogin this.acocunt', this.account);
    return this.account;
  }
  hLogin() {
    if (!this.form.value.username) {
      return;
    }
    if (!this.form.value.password) {
      return;
    }
    this.ticketlogin({ Username: this.form.value.username, Password: this.form.value.password });
  }
  login = async () => {
    //console.log('You Click Login Button');
    //var user = this.authService.login(this.form.value.username, this.form.value.password);
    //var user = setTimeout(() => this.authService.login(this.form.value.username, this.form.value.password), 750);

    var user = await this.authService.ticketlogin({ Username: this.form.value.username, Password: this.form.value.password });

    console.log('this.account at login.component.ts inside if else statemet  115', user);

    //this.account =user.next(user.account);
    console.log('this.account at login.component.ts', Object.keys(user).length);

    if (Object.keys(user).length == 0) {
      this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-exclamation', Message: 'Invalid Username and Password', ButtonText: 'Error', isConfirm: false } } });
      this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
        if (o.item.isConfirm) {
          //this.hReload();
          return;
        }
      });
      return;
    }
    else if (Object.keys(user).length > 0) {
      console.log('this.account at login.component.ts inside if else statemet', user);
      this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-check', Message: 'Login Successfully', ButtonText: 'Success', isConfirm: true } } });
      this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
        if (o.item.isConfirm) {
          this.hReload();
          //return;
        }
      });
      //this.zone.run(() => this.router.navigate(['/']));
      //window.location.reload();
    }
  }

  forgotPassword() {
    const storageData = this.ls.getItem1('SetPassword');
    if (storageData) {
      localStorage.removeItem('SetPassword');
      return;
    }

    const data = {
      forgotToken: btoa('forgotpassword')
    }
    this.ls.setItem('SetPassword', JSON.stringify(data));
    this.router.navigate(['otp']);
  }
}
