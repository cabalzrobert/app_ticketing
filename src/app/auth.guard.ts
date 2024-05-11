import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { rest } from './+services/services';
import { jUser } from './+app/user-module';

export const authGuard: CanActivateFn = (route, state) => {

  if (inject(AuthService).session) {
    let auth: any = inject(AuthService).session;
    rest.setBearer(auth.Token);
    //console.log('Auth Guard', jUser());
    return true;
  }
  inject(Router).navigateByUrl('/');
  return false;
};
