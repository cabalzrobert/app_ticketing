import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRolesModalComponent } from './view-roles-modal.component';

describe('ViewRolesModalComponent', () => {
  let component: ViewRolesModalComponent;
  let fixture: ComponentFixture<ViewRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewRolesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
