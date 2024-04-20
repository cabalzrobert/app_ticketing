import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewPositionModalComponent } from './new-position-modal/new-position-modal.component';

@Component({
  selector: 'app-settingsposition',
  templateUrl: './settingsposition.component.html',
  styleUrl: './settingsposition.component.scss'
})
export class SettingspositionComponent {
  constructor(public dialog: MatDialog) { }
  NewPosition() {
    this.dialog.open(NewPositionModalComponent, {
      width: 'fit-content',
      height: 'fit-content'
    })
  }
}
