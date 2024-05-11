import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-roles-modal',
  templateUrl: './view-roles-modal.component.html',
  styleUrl: './view-roles-modal.component.scss'
})
export class ViewRolesModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public Roles: { item: any }, public dialogRef: MatDialogRef<ViewRolesModalComponent>) { }
  closeddialog() {
    this.dialogRef.close();
  }

}
