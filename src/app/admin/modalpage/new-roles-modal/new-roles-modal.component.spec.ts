import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRolesModalComponent } from './new-roles-modal.component';

describe('NewRolesModalComponent', () => {
  let component: NewRolesModalComponent;
  let fixture: ComponentFixture<NewRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewRolesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
