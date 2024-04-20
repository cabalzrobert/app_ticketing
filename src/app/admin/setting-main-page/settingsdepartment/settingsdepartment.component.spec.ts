import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsdepartmentComponent } from './settingsdepartment.component';

describe('SettingsdepartmentComponent', () => {
  let component: SettingsdepartmentComponent;
  let fixture: ComponentFixture<SettingsdepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsdepartmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsdepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
