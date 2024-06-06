import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { ticketAuthChildGuard } from './ticket-auth-child.guard';

describe('ticketAuthChildGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ticketAuthChildGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
