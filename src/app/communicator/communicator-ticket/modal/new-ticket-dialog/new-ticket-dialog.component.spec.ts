import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTicketDialogComponent } from './new-ticket-dialog.component';

describe('NewTicketDialogComponent', () => {
  let component: NewTicketDialogComponent;
  let fixture: ComponentFixture<NewTicketDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewTicketDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
