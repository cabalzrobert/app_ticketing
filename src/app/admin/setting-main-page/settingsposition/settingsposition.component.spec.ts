import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingspositionComponent } from './settingsposition.component';

describe('SettingspositionComponent', () => {
  let component: SettingspositionComponent;
  let fixture: ComponentFixture<SettingspositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingspositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingspositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
