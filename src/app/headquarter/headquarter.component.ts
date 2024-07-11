import { Component, EventEmitter, HostListener, NgZone, OnInit, Output } from '@angular/core';
import { ApiserviceService } from '../+services/service.api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEmail } from '../tools/global';
import { rest } from '../+services/services';
import { device } from '../tools/plugins/device';
import { LocalStorageService } from '../tools/plugins/localstorage';
interface HeadquarterComponentToggle {
  screenWidth: number;
}
@Component({
  selector: 'app-headquarter',
  templateUrl: './headquarter.component.html',
  styleUrl: './headquarter.component.scss'
})
export class HeadquarterComponent implements OnInit {
  form: FormGroup = this.fb.group({
    HeadOfficeName: ['', Validators.required],
    HeadOfficeAddress: ['', Validators.required],
    HeadOfficeTelephoneNumber: ['', Validators.required],
    HeadOfficeEmailAddress: ['', Validators.required],
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    MiddleInitial: ['', Validators.required],
    Username: ['', Validators.required],
    Password: ['', Validators.required],
    MobileNumber: ['', Validators.required],
    EmailAddress: ['', Validators.required]
  });
  screenWidth = 0;
  containerWidht = 0
  screenHeight = 0;
  size = "";
  width = "";
  height = "";
  constructor(private apiservice: ApiserviceService, public router: Router, public fb: FormBuilder, private zone: NgZone, private ls: LocalStorageService) { }
  @HostListener('window:resize', ['$event'])
  //@Output() onToggleHeadquarterComponent: EventEmitter<HeadquarterComponentToggle> = new EventEmitter();
  onWindowInitialize() {
    this.screenWidth = window.innerWidth;
    this.containerWidht = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth > 768) {
      this.size = "600px";
      //this.onToggleHeadquarterComponent.emit({ screenWidth: this.screenWidth });
    }
    else {
      this.size = "";
      //this.onToggleHeadquarterComponent.emit({ screenWidth: this.screenWidth });
    }
    if (this.containerWidht > 360)
      this.width = "100%";
    else
      this.width = "";
    if (this.screenHeight > 900)
      this.height = "100%";
    else
      this.height = "";
    // this.collapsed = true;
    console.log('onWindowInitialize this.this.containerWidht', this.containerWidht);
    console.log('onWindowInitialize this.screenWidth', this.screenWidth);
    console.log('onWindowInitialize this.screenHeight', this.screenHeight);
    //this.onToggleHeadquarterComponent.emit({ screenWidth: this.screenWidth });
  }
  onResize(event: any) {
    console.log('onResize', window.innerWidth);
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.size = "300px";
    }
    else {
      this.size = "600px";
    }
    console.log('onResize this.size', this.size);
  }
  ngOnInit(): void {
    this.onWindowInitialize();
    //this.onToggleHeadquarterComponent.emit({ screenWidth: this.screenWidth });
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
      }, (err: any) => {
        this.router.navigateByUrl('/headquarter');
      });
    } catch {
      //this.dbIsEmpty(false);
      //console.log('ERROR');
      //alert('System Error');
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
  sessionNotEmpty1(): boolean {
    //console.log('sessionNotEmpty this.authService.session', this.authService.session);
    //if (this.authService.session) return true;
    //console.log('sesseionNotEmpty landing.component.ts line 54');
    return false;
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
  SaveHeadOffice() {
    console.log('Your Click Save Button Head Office');
    if (!this.isValidateEntries()) return;
    console.log('SaveHeadOffice this.form.value', this.form.value);
    setTimeout(() => this.performSubmit(), 750);
  }
  private performSubmit() {
    rest.post('headoffice', this.form.value).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        alert(res.message);
        this.ls.clear();
        //window.location.reload();
        this.router.navigateByUrl('/login');
      }
    }, (err: any) => {
      alert('Please try again');
    });
  }
  private isValidateEntries(): boolean {
    if (!this.form.value.HeadOfficeName) {
      alert('Please Enter Compnay Name.');
      return false;
    }
    if (!this.form.value.HeadOfficeAddress) {
      alert('Please Enter Compnay Address.');
      return false;
    }
    if (!this.form.value.HeadOfficeTelephoneNumber) {
      alert('Please Enter Compnay Telephone Number.');
      return false;
    }
    /*
    if (!this.form.value.HeadOfficeEmailAddress) {
      alert('Please Enter Company email address.');
      return false;
    }
    if (this.form.value.HeadOfficeEmailAddress) {
      var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!this.form.value.HeadOfficeEmailAddress.match(validRegex)) {
        alert('Please Enter valid Company email address.');
        return false;
      }
    }
    */
    if (!!this.form.value.HeadOfficeEmailAddress) {
      if (!isEmail(this.form.value.HeadOfficeEmailAddress)) {
        alert('Please Enter valid Company email address.');
        return false;
      }
    }
    if (!this.form.value.FirstName) {
      alert('Please Enter your First Name');
      return false;
    }
    if (!this.form.value.LastName) {
      alert('Please Enter your Family Name');
      return false;
    }
    if (!this.form.value.MobileNumber) {
      alert('Please Enter your Mobile Number.');
      return false;
    }
    if (!this.form.value.EmailAddress) {
      alert('Please Enter your email address');
      return false;
    }
    if (!this.form.value.Username) {
      alert('Please Enter your desire username');
      return false;
    }
    if (!this.form.value.Password) {
      alert('Please Enter your Password');
      return false;
    }
    this.form.value.parmplid = '9999';
    this.form.value.parmpgrpid = '999';
    this.form.value.UserID = '99999999999999';
    return true;
  }
}
