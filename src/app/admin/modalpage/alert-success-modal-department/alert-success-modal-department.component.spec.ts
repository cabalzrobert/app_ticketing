import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSuccessModalDepartmentComponent } from './alert-success-modal-department.component';

describe('AlertSuccessModalDepartmentComponent', () => {
  let component: AlertSuccessModalDepartmentComponent;
  let fixture: ComponentFixture<AlertSuccessModalDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertSuccessModalDepartmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertSuccessModalDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
