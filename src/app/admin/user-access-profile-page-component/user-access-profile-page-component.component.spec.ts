import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessProfilePageComponentComponent } from './user-access-profile-page-component.component';

describe('UserAccessProfilePageComponentComponent', () => {
  let component: UserAccessProfilePageComponentComponent;
  let fixture: ComponentFixture<UserAccessProfilePageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAccessProfilePageComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAccessProfilePageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
