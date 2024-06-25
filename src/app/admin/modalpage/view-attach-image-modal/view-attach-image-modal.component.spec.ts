import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttachImageModalComponent } from './view-attach-image-modal.component';

describe('ViewAttachImageModalComponent', () => {
  let component: ViewAttachImageModalComponent;
  let fixture: ComponentFixture<ViewAttachImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAttachImageModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAttachImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
