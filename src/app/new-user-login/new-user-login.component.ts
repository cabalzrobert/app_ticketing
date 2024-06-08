import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { rest } from '../+services/services';
import { error } from 'console';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-user-login',
  templateUrl: './new-user-login.component.html',
  styleUrl: './new-user-login.component.scss'
})
export class NewUserLoginComponent {
  // _username = '';
  form: FormGroup = this.fb.group({
    username: ''
  });
  errorMessage = '';
  constructor(private route: Router, private fb: FormBuilder) { }

  // onInput(val: string){
  //   this.username=val;
  //   console.log(this.username);
  // }

  ngOnInit() {
    // alert('LET\'S FUCKIN\' GO!!!!');
    // const isLocalStorageExist = localStorage.getItem('NewUserLogin');
    // if (!isLocalStorageExist)
    //   return;
    // localStorage.removeItem('NewUserLogin');
  }

  onLogin() {
    let _username = this.form.value.username;
    const data: any = {};
    if(!_username.startsWith('09'))
      this.errorMessage = 'Username doesn\'t exist';
    if(!isNaN(_username)||_username.startsWith('+639')){
      _username = _username.replace('+63','0');
      _username = _username.substring(1,_username.length);
    }
    rest.post(`newUserLogin?username=${_username}`, {})
      .subscribe(async (res: any) => {
        if (res.Status === 'ok') {
          console.log(res);
          data.userId = res.UserId;
          data.username = _username;
          this.saveLocalStorage(data);
          return this.route.navigateByUrl('/otp');
        }
        this.errorMessage = 'Username doesn\'t exist';
        return;
      }, (err: any) => {
        console.log(err);
      });
  }

  saveLocalStorage(data: any) {
    const isLocalDataExist = localStorage.getItem("SetPassword");
    if (!!isLocalDataExist) {
      localStorage.removeItem('SetPassword');
    }
    // const newArray = [];
    // newArray.push(data);
    localStorage.setItem('SetPassword', JSON.stringify(data));
  }
}
