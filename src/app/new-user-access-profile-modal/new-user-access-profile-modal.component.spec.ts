import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserAccessProfileModalComponent } from './new-user-access-profile-modal.component';

describe('NewUserAccessProfileModalComponent', () => {
  let component: NewUserAccessProfileModalComponent;
  let fixture: ComponentFixture<NewUserAccessProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewUserAccessProfileModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewUserAccessProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
