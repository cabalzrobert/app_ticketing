import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-position-modal',
  templateUrl: './view-position-modal.component.html',
  styleUrl: './view-position-modal.component.scss'
})
export class ViewPositionModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public Position: { item: any }, public diallogRef: MatDialogRef<ViewPositionModalComponent>) { }
  closeddialog() {
    this.diallogRef.close();
  }

}
