import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSuccessModalComponent } from './alert-success-modal.component';

describe('AlertSuccessModalComponent', () => {
  let component: AlertSuccessModalComponent;
  let fixture: ComponentFixture<AlertSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertSuccessModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
