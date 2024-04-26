import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestorticketpageComponent } from './requestorticketpage.component';

describe('RequestorticketpageComponent', () => {
  let component: RequestorticketpageComponent;
  let fixture: ComponentFixture<RequestorticketpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestorticketpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestorticketpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
