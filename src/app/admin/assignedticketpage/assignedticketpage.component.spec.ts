import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedticketpageComponent } from './assignedticketpage.component';

describe('AssignedticketpageComponent', () => {
  let component: AssignedticketpageComponent;
  let fixture: ComponentFixture<AssignedticketpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignedticketpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignedticketpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
