import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const headAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // if(route.url.toString() === 'tickets'){
  //   router.navigate(['tickets']);
  //   return true;
  // }
  return true;
};
