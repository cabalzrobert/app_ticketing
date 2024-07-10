import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { rest } from '../+services/services';
const timerDone = new Subject<boolean>();

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent {
  storageData: any;
  otp: any;
  userId = '';
  inputErrorMsg: any;
  generatedOtp = '';
  _timer = 0;
  otpStatus = {
    isSuccess: false,
    message: '',
    isIconShow: false
  }
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
    placeholder: '',
    inputStyles: {
      'width': '40px',
      'height': '56px',
      'border': '#4B6CB7 1px solid',
      'border-radius': '8px',
      'outline': 'none'
    }
  };

  form: FormGroup = this.formBuilder.group({
    mobileNumber: ''
  });

  @ViewChild('successErrorIcon') successErrorIcon: ElementRef | undefined;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    const isLocalExist = localStorage.getItem('SetPassword');
    if (isLocalExist){
      this.storageData = JSON.parse(isLocalExist);
      this.form.patchValue(this.storageData);
    }
  }

  onOtpChange(otp: string) {
    this.otp = otp;
    // console.log(otp);
  }

  onSendingOtp(e: any) {
    e.preventDefault();
    e.stopPropagation();
    if(this.form.value.mobileNumber.length !== 10){
      this.inputErrorMsg = 'Mobile number entered is invalid';
      return;
    }
    if (this._timer === 0)
      this.sendOtp();
    this.inputErrorMsg = null;
  }

  sendOtp = async () => {
    console.log('otp');
    const _mobileNumber = '+63' + this.form.value.mobileNumber
    const input = { UserId: this.getLocalStorage(), MobileNumber: _mobileNumber };
    rest.post('otp', input).subscribe(async (res: any) => {
      if (res.Status === 'ok') {
        this.generatedOtp = res.Otp;
        alert('your otp ' + this.generatedOtp);
        return this.startTimer();
      }
      console.log('Failed to send otp');
    }, (err: any) => {
      console.log('System Error');
    });
  }

  getLocalStorage(): any {
    const localData = localStorage.getItem('SetPassword');
    if (!!localData)
      return JSON.parse(localData).userId;
  }


  generateOtp() {
    this.generatedOtp = Math.floor(100000 + Math.random() * 899999).toString();
    console.log(this.generatedOtp);
  }

  startTimer() {
    // this.generateOtp();
    this._timer = 300;
    timer(1000, 1000)
      .pipe(takeUntil(timerDone))
      .subscribe({
        next: () => {
          // console.log( this._timer);
          this._timer -= 1;
          if (this._timer < 1)
            timerDone.next(true);
        },
        complete: () => {
          console.log('timer completed!')
        },
      })

  }

  resendCode() {
    if (this._timer < 1)
      this.sendOtp();
  }

  onSubmit = async () => {
    this.otpStatus.isIconShow = false;
    if (this.otp === this.generatedOtp && this._timer > 0) {
      // timerDone.next(true);
      // this._timer = 0;
      
      this.storageData.mobileNumber = this.form.value.mobileNumber;
      this.storageData.successOtp = this.otp;
      this.otpStatus.isSuccess = true;
      this.saveLocalStorage(this.storageData);
      setTimeout(() => this.router.navigateByUrl('/setPassword'), 725);
    }
    else if (this.form.value.mobileNumber && this.otp !== this.generatedOtp)
      this.otpStatus.message = 'Invalid code entered';
    else if (this.otp===this.generatedOtp && this._timer < 1)
      this.otpStatus.message = 'Code is expired';
    else
      this.otpStatus.message = 'Please enter a mobile number';

    setTimeout(() => this.otpStatus.isIconShow = true, 0);
  }

  saveLocalStorage(data: any){
    const isLocalStorageExist = localStorage.getItem('SetPassword');
    if(!isLocalStorageExist)
      return;
    localStorage.setItem('SetPassword',JSON.stringify(data));

  }
}
