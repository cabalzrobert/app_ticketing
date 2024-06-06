import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { rest } from './+services/services';
import { jUser } from './+app/user-module';
import { device } from './tools/plugins/device';
import { stomp } from './+services/stomp.service';

export const authGuard: CanActivateFn = (route, state) => {

  console.log('Auth Guard');
  if (inject(AuthService).session) {
    let auth: any = inject(AuthService).session;
    device.ready(() => rest.setBearer(auth.Token)) ;
    console.log('Auth Guard', auth);
    //stomp.ready(() => (stomp.refresh(), stomp.connect()));
    return true;
  }
  
  stomp.ready(() => (stomp.refresh(), stomp.connect()))
  inject(Router).navigateByUrl('/');
  

  
  return false;
};


