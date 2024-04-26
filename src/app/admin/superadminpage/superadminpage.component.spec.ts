import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminpageComponent } from './superadminpage.component';

describe('SuperadminpageComponent', () => {
  let component: SuperadminpageComponent;
  let fixture: ComponentFixture<SuperadminpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuperadminpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuperadminpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
