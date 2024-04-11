import { Component } from '@angular/core';
import { ApiserviceService } from '../+services/service.api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEmail } from '../tools/global';
import { rest } from '../+services/services';

@Component({
  selector: 'app-headquarter',
  templateUrl: './headquarter.component.html',
  styleUrl: './headquarter.component.scss'
})
export class HeadquarterComponent {
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
  constructor(private apiservice: ApiserviceService, public router: Router, public fb: FormBuilder) { }
  SaveHeadOffice() {
    console.log('Your Click Save Button Head Office');
    if (!this.isValidateEntries()) return;
    console.log('SaveHeadOffice this.form.value', this.form.value);
    setTimeout(() => this.performSubmit(), 750);
  }
  private performSubmit(){
    rest.post('headoffice',this.form.value).subscribe(async(res:any)=>{
      if(res.Status == 'ok'){
        alert(res.message);
        this.router.navigateByUrl('/login');
      }
    },(err:any)=>{
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
