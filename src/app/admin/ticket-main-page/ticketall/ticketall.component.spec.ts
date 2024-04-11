import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketallComponent } from './ticketall.component';

describe('TicketallComponent', () => {
  let component: TicketallComponent;
  let fixture: ComponentFixture<TicketallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
