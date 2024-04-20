import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingscategoryComponent } from './settingscategory.component';

describe('SettingscategoryComponent', () => {
  let component: SettingscategoryComponent;
  let fixture: ComponentFixture<SettingscategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingscategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingscategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
