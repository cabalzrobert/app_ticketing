import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { headAuthGuard } from './head-auth.guard';

describe('headAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => headAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
