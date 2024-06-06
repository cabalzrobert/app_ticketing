import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const ticketAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  alert('weweweewewewe ' + route);
  // router.navigate(['head/dashboard','tickets','sample']);
  return true;
};
