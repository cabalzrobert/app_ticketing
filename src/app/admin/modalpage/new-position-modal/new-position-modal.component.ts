import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { rest } from '../../../+services/services';

@Component({
  selector: 'app-new-position-modal',
  templateUrl: './new-position-modal.component.html',
  styleUrl: './new-position-modal.component.scss'
})
export class NewPositionModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public Position: { item: any, Title:String }, private auhtService: AuthService, private fb: FormBuilder, public dialogRef: MatDialogRef<NewPositionModalComponent>) { }
  ngOnInit(): void {
    this.form.patchValue(this.Position.item)
    console.log('ngOnit', this.form.value);
  }

  form:FormGroup = this.fb.group({
    Positionname: ['', Validators.required],
    PositionID: ''
  });

  newdialog() {
    if(!this.isValidateEntries()) return;
    this.performSave();
  }
  closeddialog() {
    this.dialogRef.close();
  }
  performSave(){
    /*
    console.log('performSaveDepartment', this.form.value);
    this.dialogRef.close(this.form.value);
    */
    
    rest.post('position/save',this.form.value).subscribe(async(res:any) => {
      if(res.Status == 'ok'){
        this.form.value.PositionID = res.Content.PositionID;
        console.log('performSave Position', this.form.value);
        this.dialogRef.close(this.form.value);
      }
    })
    
  }
  public isValidateEntries():boolean{
    if(!this.form.value.Positionname){
      alert('Please Enter Position Name.');
      return false;
    }
    return true;
  }

}
