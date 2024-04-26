import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VIewDepartmentModalComponent } from './view-department-modal.component';

describe('VIewDepartmentModalComponent', () => {
  let component: VIewDepartmentModalComponent;
  let fixture: ComponentFixture<VIewDepartmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VIewDepartmentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VIewDepartmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
