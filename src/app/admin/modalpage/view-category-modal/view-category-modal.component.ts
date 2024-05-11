import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-category-modal',
  templateUrl: './view-category-modal.component.html',
  styleUrl: './view-category-modal.component.scss'
})
export class ViewCategoryModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public Category: { item: any }, public dialogRef: MatDialogRef<ViewCategoryModalComponent>) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  closeddialog() {
    this.dialogRef.close();
  }

}
