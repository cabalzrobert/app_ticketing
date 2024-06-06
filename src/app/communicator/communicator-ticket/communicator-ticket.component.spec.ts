import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicatorTicketComponent } from './communicator-ticket.component';

describe('CommunicatorTicketComponent', () => {
  let component: CommunicatorTicketComponent;
  let fixture: ComponentFixture<CommunicatorTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunicatorTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunicatorTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
