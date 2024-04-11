import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquarterComponent } from './headquarter.component';

describe('HeadquarterComponent', () => {
  let component: HeadquarterComponent;
  let fixture: ComponentFixture<HeadquarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeadquarterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeadquarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
