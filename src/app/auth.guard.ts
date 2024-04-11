import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  if(inject(AuthService).session){
    console.log('authGuard inject(AuthService).session', inject(AuthService).session);
    return true;
  } 
  inject(Router).navigateByUrl('/');
  return false;
};
