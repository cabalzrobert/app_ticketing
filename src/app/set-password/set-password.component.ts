import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { rest } from '../+services/services';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss'
})
export class SetPasswordComponent {
  showPassword = false;
  showConfirmPassword = false;
  password = '';
  form: FormGroup = this.formBuilder.group({
    newPassword: '',
    confirmPassword: ''
  });

  isValidation = true;
  validation = {
    lowercase: true,
    uppercase: true,
    number: true,
    specialChar: true,
    length: true,
    passwordMatch: true
  }
  mobileNumber = '';
  isSuccess = false;

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // const isLocalStorageExist = localStorage.getItem('NewUserLogin');
    // if (!isLocalStorageExist)
    //   this.router.navigateByUrl('/login');
    const storageData = localStorage.getItem('SetPassword');
    if(storageData){
      this.mobileNumber = '+63' + JSON.parse(storageData).mobileNumber;
    }
  }

  getLocalStorage(): any {
    const localData = localStorage.getItem('NewUserLogin');
    if (!!localData) {
      return JSON.parse(localData).userId;
    }
  }

  isValidate(): boolean {
    var isValid = true;

    const newPassword = this.form.value.newPassword;
    const confirmPassword = this.form.value.confirmPassword;
    const hasUpper = new RegExp('[A-Z]');
    const hasLower = new RegExp('[a-z]');
    const hasNumber = new RegExp('[0-9]');
    const hasSpecialChar = new RegExp('[!@#$%^&*()_]');
    const hasWhiteSpace = new RegExp('[ \n\r\t\f]');
    this.validation = {
      lowercase: true,
      uppercase: true,
      number: true,
      specialChar: true,
      length: true,
      passwordMatch: true
    }

    if (!hasLower.test(newPassword)) {
      this.validation.lowercase = false;
      isValid = false;
    }

    if (!hasUpper.test(newPassword)) {
      this.validation.uppercase = false;
      isValid = false;
    }

    if (!hasNumber.test(newPassword)) {
      this.validation.number = false;
      isValid = false;
    }

    if (!hasSpecialChar.test(newPassword)) {
      this.validation.specialChar = false;
      isValid = false;
    }

    if (hasWhiteSpace.test(newPassword)) {
      this.validation.specialChar = false;
      isValid = false;
    }

    if (newPassword.length < 6) {
      this.validation.length = false;
      isValid = false;
    }

    this.isValidation = isValid;
    if (isValid) {
      if (newPassword !== confirmPassword) {
        this.validation.passwordMatch = false;
        isValid = false;
      }
      else
        this.password = btoa(this.form.value.newPassword);
    }
    return isValid;
  }

  countdown = 0;
  startTimer() {
    // this.generateOtp();
    const timerDone = new Subject<boolean>();
    this.countdown = 5;
    timer(1000, 1000)
      .pipe(takeUntil(timerDone))
      .subscribe({
        next: () => {
          // console.log( this._timer);
          this.countdown -= 1;
          if (this.countdown < 1)
            timerDone.next(true);
        },
        complete: () => {
          localStorage.removeItem('SetPassword');
          this.router.navigateByUrl('/login');
        },
      })

  }

  onSubmit() {
    if (!this.isValidate()) return;
    const input = { UserId: this.getLocalStorage(), MobileNumber: this.mobileNumber, Password: this.password };
    rest.post('setPassword', input).subscribe(async (res: any) => {
      if (res.Status === 'ok') {
        this.isSuccess = true;
        return this.startTimer();
      }
      console.log('failed to set a password');
      return;
    }, (err: any) => {
      console.log('System Error');
    })
  }
}
