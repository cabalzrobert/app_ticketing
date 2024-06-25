import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProgressModalComponent } from './ticket-progress-modal.component';

describe('TicketProgressModalComponent', () => {
  let component: TicketProgressModalComponent;
  let fixture: ComponentFixture<TicketProgressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketProgressModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketProgressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
