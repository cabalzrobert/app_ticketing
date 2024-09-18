import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDescriptionModalComponent } from './ticket-description-modal.component';

describe('TicketDescriptionModalComponent', () => {
  let component: TicketDescriptionModalComponent;
  let fixture: ComponentFixture<TicketDescriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketDescriptionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketDescriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
