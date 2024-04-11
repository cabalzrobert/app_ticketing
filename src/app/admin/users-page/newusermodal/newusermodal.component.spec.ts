import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewusermodalComponent } from './newusermodal.component';

describe('NewusermodalComponent', () => {
  let component: NewusermodalComponent;
  let fixture: ComponentFixture<NewusermodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewusermodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewusermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
