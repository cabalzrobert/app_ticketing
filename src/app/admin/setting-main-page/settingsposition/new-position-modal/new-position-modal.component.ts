import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-position-modal',
  templateUrl: './new-position-modal.component.html',
  styleUrl: './new-position-modal.component.scss'
})
export class NewPositionModalComponent {
  form:FormGroup = this.fb.group({
    Categoryname:'',
    CategoryID:''
  })
  constructor(private authService: AuthService, private fb: FormBuilder, public diaglogRef: MatDialogRef<NewPositionModalComponent>) { }
  closeddialogNewPosition() {
    this.diaglogRef.close();
  }
  newdialogNewPosition(){
    if(!this.isValidEntries()) return;
    console.log('newdialogNewPosition', this.form.value);
  }
  public isValidEntries():boolean{
    if(!this.form.value.Categoryname){
      alert('Please Enter Category');
      return false;
    }
    return true;
  }
}
