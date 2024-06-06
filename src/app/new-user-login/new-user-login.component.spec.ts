import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserLoginComponent } from './new-user-login.component';

describe('NewUserLoginComponent', () => {
  let component: NewUserLoginComponent;
  let fixture: ComponentFixture<NewUserLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewUserLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewUserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
