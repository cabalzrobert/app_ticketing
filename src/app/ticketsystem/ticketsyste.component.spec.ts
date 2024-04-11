import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsysteComponent } from './ticketsyste.component';

describe('TicketsysteComponent', () => {
  let component: TicketsysteComponent;
  let fixture: ComponentFixture<TicketsysteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketsysteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketsysteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
