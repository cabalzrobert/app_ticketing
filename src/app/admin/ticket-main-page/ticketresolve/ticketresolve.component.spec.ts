import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketresolveComponent } from './ticketresolve.component';

describe('TicketresolveComponent', () => {
  let component: TicketresolveComponent;
  let fixture: ComponentFixture<TicketresolveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketresolveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketresolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
