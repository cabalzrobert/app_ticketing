import { Component } from '@angular/core';
import { AuthService } from '../../../../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-category-modal',
  templateUrl: './new-category-modal.component.html',
  styleUrl: './new-category-modal.component.scss'
})
export class NewCategoryModalComponent {
  form: FormGroup = this.fb.group({
    Categoryname: '',
    CategoryID: ''
  })
  constructor(private authService: AuthService, private fb: FormBuilder, public dialogRef: MatDialogRef<NewCategoryModalComponent>) { }
  closeddialogNewCategory(): void {
    this.dialogRef.close();
  }
  newdialogNewCategory() {
    if (!this.isValidEntries()) return;
    console.log('newdialogNewCategory', this.form.value);
  }
  public isValidEntries(): boolean {
    if (!this.form.value.Categoryname) {
      alert('Please Enter Category.');
      return false;
    }
    return true
  }
}
