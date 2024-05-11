import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPositionModalComponent } from './view-position-modal.component';

describe('ViewPositionModalComponent', () => {
  let component: ViewPositionModalComponent;
  let fixture: ComponentFixture<ViewPositionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPositionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPositionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
