import { Inject, inject } from '@angular/core';
import { CanDeactivateFn, Router } from '@angular/router';
import { faL } from '@fortawesome/free-solid-svg-icons';

export const authDeactivateGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  // alert('currentRoute: '+ currentRoute + '\ncurrentState: ' + currentState +'nextState: '+ nextState);
  const router = inject(Router);
  if(nextState.url === '/login'){
    localStorage.removeItem('SetPassword');
    return true
  }
  else if(nextState.url === '/newUserLogin'){
    localStorage.removeItem('SetPassword');
    return true;
  }
  else if(nextState.url === '/otp'){
    const storage = localStorage.getItem('SetPassword');
    const data = JSON.parse(storage??'');
    data.successOtp = null;
    localStorage.setItem('SetPassword',JSON.stringify(data));
    return true;
  }
  else
    return true;
};
