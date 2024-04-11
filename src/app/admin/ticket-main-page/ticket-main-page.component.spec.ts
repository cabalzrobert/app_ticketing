import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketMainPageComponent } from './ticket-main-page.component';

describe('TicketMainPageComponent', () => {
  let component: TicketMainPageComponent;
  let fixture: ComponentFixture<TicketMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketMainPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
