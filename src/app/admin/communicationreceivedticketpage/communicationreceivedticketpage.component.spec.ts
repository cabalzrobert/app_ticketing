import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationreceivedticketpageComponent } from './communicationreceivedticketpage.component';

describe('CommunicationreceivedticketpageComponent', () => {
  let component: CommunicationreceivedticketpageComponent;
  let fixture: ComponentFixture<CommunicationreceivedticketpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunicationreceivedticketpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunicationreceivedticketpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
