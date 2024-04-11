import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketpendingComponent } from './ticketpending.component';

describe('TicketpendingComponent', () => {
  let component: TicketpendingComponent;
  let fixture: ComponentFixture<TicketpendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketpendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
