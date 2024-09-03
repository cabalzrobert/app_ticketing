import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintticketelapsedtimePageComponentComponent } from './printticketelapsedtime-page-component.component';

describe('PrintticketelapsedtimePageComponentComponent', () => {
  let component: PrintticketelapsedtimePageComponentComponent;
  let fixture: ComponentFixture<PrintticketelapsedtimePageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintticketelapsedtimePageComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintticketelapsedtimePageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
