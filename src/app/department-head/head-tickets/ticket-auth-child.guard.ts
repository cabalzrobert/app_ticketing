import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const ticketAuthChildGuard: CanActivateChildFn = (childRoute, state) => {
  alert('huehueuhe ' + childRoute.url);
  const route = inject(Router);
  return true;
};
