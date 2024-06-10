import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ticketAuthGuard } from './ticket-auth.guard';

describe('ticketAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ticketAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
