import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { rest } from './+services/services';
import { jUser } from './+app/user-module';
import { device } from './tools/plugins/device';
import { stomp } from './+services/stomp.service';
import { LocalStorageService } from './tools/plugins/localstorage';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  if (inject(AuthService).session) {
    let auth: any = inject(AuthService).session;
    device.ready(() => rest.setBearer(auth.Token)) ;
    console.log('Auth Guard', auth);
    //stomp.ready(() => (stomp.refresh(), stomp.connect()));
    return true;
  }
  else if(route.url.toString() === 'newUserLogin'){
    return true;
  }
  else if(route.url.toString() === 'otp'){
    if(inject(AuthService).session){
      router.navigate(['dashboard']);
      return false;
    }
    const storageData = LocalStorageService.getItem('SetPassword');
    // if(!storageData) return router.navigate(['login']);
    if(storageData)
      return true;
    else{
      router.navigate(['login']);
      return false;
    }
  }
  else if(route.url.toString() === 'setPassword'){
    if(inject(AuthService).session){
      router.navigate(['dashboard']);
      return false;
    }
    const storageData = LocalStorageService.getItem('SetPassword');
    if(storageData){
      if(JSON.parse(storageData).successOtp)
        return true;
      else{
        return false;
      }
    }
    else{
      router.navigate(['login']);
      return false;
    }
  }
  else if(route.url.toString() === 'head'){
    router.navigate(['head/dashboard','overview']);
    return true;
  }
  else if(route.url.toString() === 'communicator'){
    // alert('communicator');
    router.navigate(['communicator/dashboard','overview']);
    return true;
  }
  else if(inject(AuthService).session){
    console.log('authGuard inject(AuthService).session', inject(AuthService).session);
    return true;
  } 
  else{
    stomp.ready(() => (stomp.refresh(), stomp.connect()))
    inject(Router).navigateByUrl('/');
    return false;
  }
  
  // console.log('Auth Guard');
  // if (inject(AuthService).session) {
  //   let auth: any = inject(AuthService).session;
  //   device.ready(() => rest.setBearer(auth.Token)) ;
  //   console.log('Auth Guard', auth);
  //   //stomp.ready(() => (stomp.refresh(), stomp.connect()));
  //   return true;
  // }
  
  // stomp.ready(() => (stomp.refresh(), stomp.connect()))
  // inject(Router).navigateByUrl('/');
  

  
  // return false;
};


