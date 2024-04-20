import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPositionModalComponent } from './new-position-modal.component';

describe('NewPositionModalComponent', () => {
  let component: NewPositionModalComponent;
  let fixture: ComponentFixture<NewPositionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPositionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPositionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
