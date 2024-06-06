import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router);
  // alert(childRoute.url)
  // if(childRoute.url.toString() === 'tickets'){
  //   alert('Yahhooooo');
  //   return true;
  // }
  return true;
};
