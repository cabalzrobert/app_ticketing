import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitModalDepartmentComponent } from './submit-modal-department.component';

describe('SubmitModalDepartmentComponent', () => {
  let component: SubmitModalDepartmentComponent;
  let fixture: ComponentFixture<SubmitModalDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitModalDepartmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmitModalDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
