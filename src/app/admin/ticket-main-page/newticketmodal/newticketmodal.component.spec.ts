import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewticketmodalComponent } from './newticketmodal.component';

describe('NewticketmodalComponent', () => {
  let component: NewticketmodalComponent;
  let fixture: ComponentFixture<NewticketmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewticketmodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewticketmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
