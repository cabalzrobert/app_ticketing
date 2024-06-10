import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadTicketsComponent } from './head-tickets.component';

describe('HeadTicketsComponent', () => {
  let component: HeadTicketsComponent;
  let fixture: ComponentFixture<HeadTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeadTicketsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeadTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
