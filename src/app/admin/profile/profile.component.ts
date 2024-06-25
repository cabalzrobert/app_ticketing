import { Component, Inject } from '@angular/core';
import { jUser, jUserModify } from '../../+app/user-module';
import moment from 'moment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
//import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { rest } from '../../+services/services';
import { Subject, takeUntil, timer } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { request } from 'node:http';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { LocalStorageService } from '../../tools/plugins/localstorage';
import { error } from 'node:console';
// import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';

// const __moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'LL'`,
//   },
//   display: {
//     dateInput: 'LL',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

const timerDone = new Subject<boolean>();

export interface DialogData {
  type: string,
  title: string,
  message: string,
  request: any,
  api: string
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  // providers: [provideMomentDateAdapter(MY_FORMATS),]
})
export class ProfileComponent {
  userDetail: any;
  selectedIndex = -1;

  //update basic info
  update = {
    mobileNumber: false,
    displayName: false
  }
  formBasic: FormGroup = this.fb.group({
    userId: '',
    mobileNumber: '',
    displayName: '',
    isBasicInfo: true
  });
  confirmUpdate = false;

  // update personal detail
  isUpdate = false;
  // readonly date = new FormControl(__moment());
  formPersonal: FormGroup = this.fb.group({
    userId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    birthday: '',
    address: '',
    isBasicInfo: false
  });

  formPassword: FormGroup = this.fb.group({
    mobileNumber: '',
    newPassword: '',
    confirmPassword: ''
  });

  //change password variables
  isChangePassword = false;
  otp: any;
  otpMessage!: any;
  generatedOtp = '';
  _timer = 0;
  isOtpSuccess = false;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
    placeholder: '',
    inputStyles: {
      'width': '48px',
      'height': '56px',
      'border': '#4B6CB7 1px solid',
      'border-radius': '8px',
      'outline': 'none',
      'box-shadow': ''
    }
  };
  showPassword = false;
  showConfirmPassword = false;
  validation = {
    lowercase: true,
    uppercase: true,
    number: true,
    specialChar: true,
    length: true,
    passwordMatch: true
  }
  isValidPassword = true;
  lastPasswordUpdate: any;
  
  constructor(private fb: FormBuilder, private dialog: MatDialog, private dialogRef: MatDialogRef<SidenavComponent>, private ls: LocalStorageService){}

  async ngOnInit(){
    this.userDetail = await jUser();
    
    //form bsaic info
    this.formBasic.controls['userId'].setValue(this.userDetail.USR_ID)
    this.formBasic.controls['mobileNumber'].setValue(this.userDetail.MOB_NO);
    this.formBasic.controls['displayName'].setValue(this.userDetail.NCK_NM);

    //form personal detail
    this.formPersonal.controls['userId'].setValue(this.userDetail.USR_ID)
    this.formPersonal.controls['firstName'].setValue(this.userDetail.FRST_NM);
    this.formPersonal.controls['middleName'].setValue(this.userDetail.MDL_NM);
    this.formPersonal.controls['lastName'].setValue(this.userDetail.LST_NM);
    this.formPersonal.controls['gender'].setValue(this.userDetail.GNDR);
    this.formPersonal.controls['birthday'].setValue(this.userDetail.BRT_DT);
    this.formPersonal.controls['address'].setValue(this.userDetail.HM_ADDR);
    this.formPersonal.disable();

    //form change password
    this.formPassword.controls['mobileNumber'].setValue(this.userDetail.MOB_NO);
    this.lastPasswordUpdate = this.userDetail.LST_CHNG_PSSWRD;
    console.log(this.userDetail);
  }

  updateMobileNumber(){
    this.update.mobileNumber = !this.update.mobileNumber;
    this.isOtpSuccess = false;
    if(this.update.mobileNumber)
      setTimeout(()=>this.sendOtp(),250);
    else
      timerDone.next(true);
  }

  cancelUpdateMobileNumber(){
    this.formBasic.controls['mobileNumber'].setValue(this.userDetail.MOB_NO);
    this.isOtpSuccess = false;
  }

  onPerformUpdateMobileNumber(ref: MatDialogRef<ProgressBar>){
    rest.post('profile/update',this.formBasic.value).subscribe((res:any)=>{
      ref.close();
      if(res.Status === 'ok'){
        const dialogRef = this.messageDialog('success','Success!',`Mobile number successfully updated!`,null,null);
        dialogRef.afterClosed().subscribe(()=>{
          this.update.mobileNumber = false;
          this.isOtpSuccess = false;
          const data = this.userDetail;
          data.MOB_NO = this.formBasic.get('mobileNumber')?.value;
          localStorage.setItem('UserAccount', JSON.stringify(data));
        });
        return;
      }
      this.messageDialog('failed','Failed!',`Failed to update your mobile number`,null,null);
    }, (error:any)=>{
      ref.close();
      this.messageDialog('failed','Failed!',`System Error!`,null,null);
    });
  }

  confirmUpdateMobileNumber(){
    const progress = this.dialog.open(ProgressBar);
    setTimeout(()=>this.onPerformUpdateMobileNumber(progress),725);
  }

  updateDisplayName(){
    this.update.displayName = !this.update.displayName;
    this.formBasic.controls['displayName'].setValue(this.userDetail.DSP_NM);
  }

  cancelUpdateDisplayName(){
    this.update.displayName = false;
  }

  confirmUpdateDisplayName(){
    const dialogRef = this.messageDialog('confirm','Confirm Update','Proceed with your display name update?','profile/update',this.formBasic.value);
    dialogRef.afterClosed().subscribe((result:any)=>{
      if(result){
        const dialogRef = this.messageDialog('success','Success!',`Display name successfully updated!`,null,null);
        dialogRef.afterClosed().subscribe(()=>{
            this.update.displayName = false;
            const data = this.userDetail;
            data.NCK_NM = this.formBasic.get('displayName')?.value;
            localStorage.setItem('UserAccount', JSON.stringify(data));
        });
        return;
      }
      this.messageDialog('failed','Failed!',`Failed to update your mobile number`,null,null);
    }, (error:any)=>{
      this.messageDialog('failed','Failed!',`System Error!`,null,null);
    });
  }
  
  filterDates = (d: Date | null) => {
    const today = new Date();
    if(d === null) return false;
    return d <= today
  }

  formattedDate(val:any): any{
    if(val) return moment(val).format('MMMM DD, yyyy');
  }

  select(index: number){
    this.selectedIndex = index;
  }

  willUpdate(){
    this.formDisabled();
    console.log(this.formPersonal.value);
    // console.log(this.date);
  }

  onCancel(){
    this.formDisabled();
  }

  onUpdate(){
    const dialogRef = this.messageDialog('confirm','Confirm Update','Are you sure you want to update your personal information?','profile/update',this.formPersonal.value);
    dialogRef.afterClosed().subscribe((result:any)=>{
      if(result){
        const dialogRef = this.messageDialog('success','Success!',`Display name successfully updated!`,null,null);
        dialogRef.afterClosed().subscribe(()=>{
          this.formDisabled();
            const data = this.userDetail;
            data.FRST_NM = this.formPersonal.get('firstName')?.value;
            data.MDL_NM = this.formPersonal.get('middleName')?.value;
            data.LST_NM = this.formPersonal.get('lastName')?.value;
            data.GNDR = this.formPersonal.get('gender')?.value;
            data.BRT_DT = this.formPersonal.get('birthday')?.value;
            data.HM_ADDR = this.formPersonal.get('address')?.value;
            localStorage.setItem('UserAccount', JSON.stringify(data));
        });
        return;
      }
      this.messageDialog('failed','Failed!',`Failed to update your mobile number`,null,null);
    }, (error:any)=>{
      this.messageDialog('failed','Failed!',`System Error!`,null,null);
    });
  }

  formDisabled(){
    this.isUpdate = !this.isUpdate;
    if(this.isUpdate)
      this.formPersonal.enable();
    else
      this.formPersonal.disable();
  }

  //change password methods

  willChangePassword(){
    this.isChangePassword = true;
    setTimeout(()=>this.sendOtp(),250);
  }

  onOtpChange(otp: string) {
    this.otp = otp;
    // console.log(otp);
  }

  sendOtp = async () => {
    console.log('otp');
    const input = { UserId: this.userDetail.US_ID, MobileNumber: this.userDetail.MOB_NO };
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

  startTimer() {
    // this.generateOtp();
    this._timer = 60;
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
          this._timer = 0;
          console.log('timer completed!')
        },
      })
  }

  resendCode() {
    if (this._timer < 1)
      this.sendOtp();
  }

  onSubmit = async () => {
    if (this.otp === this.generatedOtp && this._timer > 0) {
      // timerDone.next(true);
      // this._timer = 0;
      if(this.update.mobileNumber) this.formBasic.controls['mobileNumber'].setValue('');
      this.isOtpSuccess = true;
      timerDone.next(true);
      console.log('success');
    }
    else if (this.userDetail && this.otp !== this.generatedOtp){
      this.config.inputStyles.border = 'red 1px solid';
      this.config.inputStyles['box-shadow'] = 'red 0px 2px 15px -6px';
      this.otpMessage = 'Invalid code entered';
    }
    else if (this.otp===this.generatedOtp && this._timer < 1){
      this.config.inputStyles.border = 'red 1px solid';
      this.config.inputStyles['box-shadow'] = 'red 0px 2px 15px -6px';
      this.otpMessage = 'Code is expired';
    }
    else{
      this.config.inputStyles.border = '#4B6CB7 1px solid';
      this.otpMessage = null;
    }
  }
  
  onChangePassword(event: any){
    // this.ValidatePassword();
  }

  private ValidatePassword(): boolean{
    var isValid = true;

    const newPassword = this.formPassword.value.newPassword;
    const confirmPassword = this.formPassword.value.confirmPassword;
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
    console.log('new password = ',newPassword);
    if (newPassword.length < 6) {
      this.validation.length = false;
      isValid = false;
    }

    this.isValidPassword = isValid;
    if (isValid) {
      if (newPassword !== confirmPassword) {
        this.validation.passwordMatch = false;
        isValid = false;
      }
    }
    console.log(this.validation);

    return isValid;
  }

  onConfirmChangePassword(){
    if(!this.ValidatePassword()) return;
    const request = {
      MobileNumber: this.formPassword.get('mobileNumber')?.value,
      Password: btoa(this.formPassword.get('newPassword')?.value)
    }
    const dialogRef = this.messageDialog('confirm','Confirm Update','Are you sure you want to change your password?','setPassword',request);
    dialogRef.afterClosed().subscribe((result:any)=>{
      if(result){
        const dialogRef = this.messageDialog('success','Success!','Account Password Successfully updated!',null,null);
        dialogRef.afterClosed().subscribe(()=>{
          this.lastPasswordUpdate = moment(new Date()).format('MMM DD, yyyy');
          this.isChangePassword = !this.isChangePassword;
          this.isOtpSuccess = !this.isOtpSuccess;
          this.formPassword.reset();
        });
        return;
      }
      this.messageDialog('failed','Failed!',`Failed to change your password`,null,null);
    }, (error:any)=>{
      this.messageDialog('failed','Failed!',`System Error!`,null,null);
    });
  }

  onCancelChangePassword(){
    this.isOtpSuccess = false;
  }


  messageDialog(type: string, title: string, message: string, api: any, data: any): MatDialogRef<MessageDialog>{
    return this.dialog.open(MessageDialog, {
      disableClose: true,
      width: '17%',
      data: { type: type, title: title, message: message, request: data, api: api }
    });
  }
}

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.html',
  styleUrl: './message-dialog.scss',
  // providers: [provideMomentDateAdapter(MY_FORMATS),]
})

export class MessageDialog {

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<ProfileComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData){}

  close(){
    const progressRef = this.showProgressBar();
    console.log(this.data.request);
    setTimeout(()=>this.onPerformChangePassword(progressRef),725);
  }

  onPerformChangePassword(ref: MatDialogRef<ProgressBar>){
    rest.post(this.data.api, this.data.request).subscribe(async (res: any) => {
      this.hideProgressBar(ref);
      if (res.Status === 'ok') {
        return this.dialogRef.close(true);
      }
      console.log('failed to set a password');
    }, (err: any) => {
      console.log('System Error');
    })
  }

  showProgressBar(): MatDialogRef<ProgressBar>{
    return this.dialog.open(ProgressBar);
  }

  hideProgressBar(ref: MatDialogRef<ProgressBar>){
    return ref.close();
  }

}

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
  // providers: [provideMomentDateAdapter(MY_FORMATS),]
})

export class ProgressBar {

}