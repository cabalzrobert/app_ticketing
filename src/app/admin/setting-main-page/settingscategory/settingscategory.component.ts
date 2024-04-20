import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryModalComponent } from './new-category-modal/new-category-modal.component';

@Component({
  selector: 'app-settingscategory',
  templateUrl: './settingscategory.component.html',
  styleUrl: './settingscategory.component.scss'
})
export class SettingscategoryComponent {
  constructor(public dialog: MatDialog) { }
  NewCategory() {
    this.dialog.open(NewCategoryModalComponent, {
      width: 'fit-content',
      height: 'fit-content'
    });
  }

}
