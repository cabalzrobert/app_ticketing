import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { isEmail } from '../../tools/global';
import { mtCb } from '../../tools/plugins/static';
import { device } from '../../tools/plugins/device';
import { rest } from '../../+services/services';
import { ApiserviceService } from '../../+services/service.api';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {

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
  constructor(private authService: AuthService, private apiservice: ApiserviceService, public router: Router, public fb: FormBuilder) { }
  isEmpty: boolean = true;
  subs: any = {};
  // ngOnInit(){
  //   console.log('LandingComponent');
  // }
  ngOnInit(): void {
    Object.values(this.subs).map((m: any) => m.unsubscribe());
    device.ready(() => this.performCheckDB());
    console.log('Landing Components 41');
    //setTimeout(() => this.performCheckDB(), 750);
    //this.dbIsEmpty(false);
  }
  dbIsEmpty(_isEmpty: boolean) {
    if (_isEmpty == true) {
      console.log('dbIsEmpty', _isEmpty)
      this.router.navigateByUrl('/login');
    }
    else {
      this.router.navigateByUrl('/headquarter');
    }
  }
  sessionNotEmpty(): boolean {
    if (this.authService.session) return true;
    console.log('sesseionNotEmpty landing.component.ts line 54');
    return false;
  }
  private async checkDevice() { }
  private performCheckDB() {
    //console.log('performCheckDB');
    rest.post('dashboardticketing', {}).subscribe(async (res: any) => {
      //console.log('performCheckDB', res);
      //console.log('performCheckDB device.isBrowser', device.isBrowser);
      if (res.Result == 'ok') {
        //console.log('Session', localStorage.getItem('session'));
        if (this.sessionNotEmpty()) {
          this.router.navigateByUrl('/dashboard');
        }
        else
          this.dbIsEmpty(true);
      }
      else
        this.dbIsEmpty(false)
    })


    // this.apiservice.loadSubscriberList('dashboardticketing',{}).subscribe(async(res:any) => {
    //   console.log('performCheckDB res', res);
    // });

    /*
    this.apiservice.loadSubscriberList('dashboardsignin02',{Username: 'Brgy. Lahug', password: 'RXNhdEAxMjM0NTY='}).subscribe(async(res:any) => {
      console.log('performCheckDB res', res);
    });
    */

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
